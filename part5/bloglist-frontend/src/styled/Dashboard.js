import styled from "styled-components"
import { Link } from "react-router-dom"
import LogoutIcon from "../components/Logout"

export const Dash = styled.div`
  border: 1px solid green;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  /* padding: 10px; */
  min-height: 40px;
`

export const UserPanel = styled.div`
  display: flex;
  padding: 10px;
  flex-direction: row;
  flex-wrap: nowrap;
`

export const Nav = styled.nav`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 10px;
`
export const NavLink = styled(Link)`
  height: 100%;
  text-align: center;
  padding: 0px 5px;
  display: flex;
  align-items: center;

  &:hover {
    background-color: wheat;
    color: black;
  }
`

export const StyledLogoutIcon = styled(LogoutIcon)``
