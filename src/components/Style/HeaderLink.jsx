import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(NavLink)`
  color: palevioletred;
  font-weight: bold;
  text-decoration: none;
  padding: 1rem;
  transition: all 0.4s;
  &.active {
    color: #a32952;
    text-decoration: underline;
  }
`;

export default StyledLink;
