/* eslint-disable no-param-reassign, class-methods-use-this, func-names, no-underscore-dangle */
import formatDate from 'dateformat';
import {
  defaultFieldResolver,
  GraphQLString,
  GraphQLList,
  DirectiveLocation,
  GraphQLDirective
} from 'graphql';
import { SchemaDirectiveVisitor } from 'graphql-tools';

class DeprecatedDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    field.isDeprecated = true;
    field.deprecationReason = this.args.reason;
  }

  visitEnumValue(value) {
    value.isDeprecated = true;
    value.deprecationReason = this.args.reason;
  }
}

class LowerCaseDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    field.resolve = async function(...args) {
      const result = await resolve.apply(this, args);
      if (typeof result === 'string') {
        return result.toLowerCase();
      }
      return result;
    };
  }
}

class FormattableDateDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(field) {
    const { resolve = defaultFieldResolver } = field;
    const { defaultFormat } = this.args;

    field.args.push({
      name: 'format',
      type: GraphQLString
    });

    field.resolve = async function(
      source,
      { format, ...otherArgs },
      context,
      info
    ) {
      const date = await resolve.call(this, source, otherArgs, context, info);
      // If a format argument was not provided, default to the optional
      // defaultFormat argument taken by the @date directive:
      return formatDate(date, format || defaultFormat);
    };

    field.type = GraphQLString;
  }
}

class AuthDirective extends SchemaDirectiveVisitor {
  visitObject() {
    // Do Nothing
  }
  visitFieldDefinition() {
    // Do Nothing
  }
  static getDirectiveDeclaration(directiveName, schema) {
    const previousDirective = schema.getDirective(directiveName);
    if (previousDirective) {
      // If a previous directive declaration exists in the schema, it may be
      // better to modify it than to return a new GraphQLDirective object.
      previousDirective.args.forEach(arg => {
        if (arg.name === 'requires') {
          // Lower the default minimum Role from ADMIN to REVIEWER.
          arg.defaultValue = ['REVIEWER'];
        }
      });

      return previousDirective;
    }

    // If a previous directive with this name was not found in the schema,
    // there are several options:
    //
    // 1. Construct a new GraphQLDirective (see below).
    // 2. Throw an exception to force the client to declare the directive.
    // 3. Return null, and forget about declaring this directive.
    //
    // All three are valid options, since the visitor will still work without
    // any declared directives. In fact, unless you're publishing a directive
    // implementation for public consumption, you can probably just ignore
    // getDirectiveDeclaration altogether.

    return new GraphQLDirective({
      name: directiveName,
      locations: [DirectiveLocation.OBJECT, DirectiveLocation.FIELD_DEFINITION],
      args: {
        requires: {
          // Having the schema available here is important for obtaining
          // references to existing type objects, such as the Role enum.
          type: new GraphQLList(schema.getType('Role')),
          // Set the default minimum Role to REVIEWER.
          defaultValue: ['REVIEWER']
        }
      }
    });
  }
}

// class LengthDirective extends SchemaDirectiveVisitor {
//   visitInputFieldDefinition(field) {
//     this.wrapType(field);
//   }

//   visitFieldDefinition(field) {
//     this.wrapType(field);
//   }

//   // Replace field.type with a custom GraphQLScalarType that enforces the
//   // length restriction.
//   wrapType(field) {
//     if (
//       field.type instanceof GraphQLNonNull &&
//       field.type.ofType instanceof GraphQLScalarType
//     ) {
//       field.type = new GraphQLNonNull(
//         new LimitedLengthType(field.type.ofType, this.args.max)
//       );
//     } else if (field.type instanceof GraphQLScalarType) {
//       field.type = new LimitedLengthType(field.type, this.args.max);
//     } else {
//       throw new Error(`Not a scalar type: ${field.type}`);
//     }
//   }
// }

// class LimitedLengthType extends GraphQLScalarType {
//   constructor(type, maxLength) {
//     super({
//       name: `LengthAtMost${maxLength}`,

//       serialize(value) {
//         value = type.serialize(value);
//         return value;
//       },

//       parseValue(value) {
//         return type.parseValue(value);
//       },

//       parseLiteral(ast) {
//         return type.parseLiteral(ast);
//       }
//     });
//   }
// }

module.exports = {
  deprecated: DeprecatedDirective,
  lower: LowerCaseDirective,
  date: FormattableDateDirective,
  auth: AuthDirective
};
