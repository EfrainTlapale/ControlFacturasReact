import React, {Component} from 'react';

import App from 'grommet/components/App';
import Sidebar from 'grommet/components/Sidebar';
import Header from 'grommet/components/Header'
import Menu from 'grommet/components/Menu'
import Box from 'grommet/components/Box'
import Anchor from 'grommet/components/Anchor'
import Footer from 'grommet/components/Footer'
import Split from 'grommet/components/Split'
import Paragraph from 'grommet/components/Paragraph'
import Toast from 'grommet/components/Toast'
import Moment from 'moment';

Moment.locale('es')

//Router
import {BrowserRouter as Router, Route, NavLink, Redirect} from 'react-router-dom'
import Main from './components/main'
import Bills from './components/bills'
import NewBill from './components/newBill'
import Providers from './components/providers'
import Login from './components/login'
import Vehicles from './components/vehicles'
import ViewBill from './components/viewBill'
import EditBill from './components/editBill'
import Users from './components/users'

import decode from 'jwt-decode'

const navTextStyle = {
  color: 'white',
  textDecoration: 'none'
}

// import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter'

const loggedin = () => {
  return !!localStorage.getItem('jwt')
}

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    decode(localStorage.getItem('jwt'))._doc.role === 'director' ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

export default class AppReact extends Component {
  state = {
    mainActive: true,
    loggedIn: loggedin(),
    margin: 240,
    showToast: false,
    toastStatus: 'ok',
    toastMessage: '',
    username: {}
  }

  handleLogin = () => {
    this.setState({
      loggedIn: !this.state.loggedIn
    })
  }

  handleLogOut = () => {
    localStorage.removeItem('jwt')
    this.setState({
      loggedIn: false
    })
  }

  handleShowToast = (status, message) => {
    this.setState(() => ({toastStatus: status, toastMessage: message, showToast: true}))
  }

  handleToastClose = () => {
    this.setState(() => ({showToast: false}))
  }

  render(){
    const jwt = localStorage.getItem('jwt')
    let username
    let role
    if(jwt){
      role =decode(jwt)._doc.role 
      username =decode(jwt)._doc.username 
    }
    return (
      this.state.loggedIn ? 
      <Router>
        <App centered={false} lang='es' >
          <Split flex='right' fixed={false} onResponsive={(col) => col === 'multiple' ? this.setState(() => ({margin: 240})) : this.setState(() => ({margin: 0})) }>
            <Sidebar style={{position: 'fixed'}} colorIndex='neutral-2-a' fixed size='small'>
              <Header pad='medium'>
                <b><h2>Control de Facturas</h2></b>
              </Header>
              <Box flex='grow'
                justify='start'>
                <Menu primary={true}>
                  <Box align='center' style={{marginBottom: '20px'}}>
                    {jwt && <b>Hola {username}</b>}
                  </Box>
                  <NavLink exact to='/' style={navTextStyle}>
                      <span>Inicio</span>
                  </NavLink>
                  <NavLink exact to='/alta' style={navTextStyle}>
                      <span>Alta Facturas</span>
                  </NavLink>
                  <NavLink exact to='/facturas' style={navTextStyle}>
                      <span>Consulta Facturas</span>
                  </NavLink>
                  <NavLink exact to='/proveedores' style={navTextStyle}>
                      <span>Proveedores</span>
                  </NavLink>
                  <NavLink exact to='/vehiculos' style={navTextStyle}>
                      <span>Vehículos</span>
                  </NavLink>
                  {role === 'director' && <NavLink exact to='/users' style={navTextStyle}>
                      <span>Usuarios</span>
                  </NavLink>}
                  <Anchor onClick={this.handleLogOut}>
                    Salir
                  </Anchor>
                </Menu>
              </Box>
              <Footer justify='between'>
                <Box direction='row'
                  align='center'
                  pad={{"between": "medium"}}>
                  <Paragraph margin='none'>
                    <a href="http://guacamoledev.com" style={navTextStyle} target='_blank'>© 2017 Guacamole Dev</a>
                  </Paragraph>
                </Box>
              </Footer>
            </Sidebar>
            <Box style={{marginLeft: this.state.margin + 'px'}}>
              {this.state.showToast && <Toast onClose={this.handleToastClose} status={this.state.toastStatus}>{this.state.toastMessage}</Toast>}
              <Route exact path='/' component={Main}/>
              <Route exact path='/facturas' component={Bills}/>
              <Route exact path='/alta' component={NewBill} />
              <Route exact path='/proveedores' component={Providers} />
              <Route exact path='/vehiculos' component={Vehicles} />
              <Route path='/factura/:id' render={(props) => <ViewBill {...props} handleShowToast={(status, message) => this.handleShowToast(status, message)}/> } />
              <Route path='/editarFactura/:id' component={EditBill} />
              <PrivateRoute path='/users' component={Users} />
            </Box>
          </Split>
        </App>
      </Router>
      :
      <App centered={false} lang='es'>
        <Login handleLogin={this.handleLogin}/>
      </App>
    )
  }
}
