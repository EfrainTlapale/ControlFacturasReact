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
import Moment from 'moment';

Moment.locale('es')

//Router
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom'
import Main from './components/main'
import Bills from './components/bills'
import NewBill from './components/newBill'
import Providers from './components/providers'
import Login from './components/login'
import Vehicles from './components/vehicles'
import ViewBill from './components/viewBill'

const navTextStyle = {
  color: 'white',
  textDecoration: 'none'
}

// import AnnotatedMeter from 'grommet-addons/components/AnnotatedMeter'

const loggedin = () => {
  return !!localStorage.getItem('jwt')
}

export default class AppReact extends Component {
  state = {
    mainActive: true,
    loggedIn: loggedin()
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

  componentWillMount(){
  }

  render(){
    return (
      this.state.loggedIn ? 
      <Router>
        <App centered={false} lang='es' >
          <Split flex='right'>
            <Sidebar colorIndex='neutral-2-a' fixed={true} size='small'>
              <Header pad='medium'>
                <b><h2>Control de Facturas</h2></b>
              </Header>
              <Box flex='grow'
                justify='start'>
                <Menu primary={true}>
                  <NavLink exact to='/' style={navTextStyle}>
                      <span>Inicio</span>
                  </NavLink>
                  <NavLink exact to='/alta' style={navTextStyle}>
                      <span>Alta Facturas</span>
                  </NavLink>
                  <NavLink exact to='/consulta' style={navTextStyle}>
                      <span>Consulta Facturas</span>
                  </NavLink>
                  <NavLink exact to='/proveedores' style={navTextStyle}>
                      <span>Proveedores</span>
                  </NavLink>
                  <NavLink exact to='/vehiculos' style={navTextStyle}>
                      <span>Vehículos</span>
                  </NavLink>
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
            <Box>
              <Route exact path='/' component={Main}/>
              <Route exact path='/consulta' component={Bills}></Route>
              <Route exact path='/alta' component={NewBill}></Route>
              <Route exact path='/proveedores' component={Providers} />
              <Route exact path='/vehiculos' component={Vehicles} />
              <Route path='/factura/:id' component={ViewBill} />
            </Box>
          </Split>
        </App>
      </Router>
      :
      <App centered={false}>
        <Login handleLogin={this.handleLogin}/>
      </App>
    )
  }
}
