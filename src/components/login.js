import React, {Component} from 'react'
import Split from 'grommet/components/Split'
import Box from 'grommet/components/Box'
import LoginForm from 'grommet/components/LoginForm'
import Title from 'grommet/components/Title'
import Spinning from 'grommet/components/icons/Spinning'
import Image from 'grommet/components/Image'

import logo from '../images/LOGOTLAXGOB17.jpg'

import axios from 'axios'

class Login extends Component{
  state = {
    error: false,
    loading: false
  }
  handleLoginSubmit = (e) => {
    this.setState({
      loading: true,
      error: false
    })
    const {username, password} = e
    axios.post('/api/login', {
      username,
      password
    })
    .then(({data}) => {
      this.setState({
        loading: false
      })
      localStorage.setItem('jwt', data.token)
      this.props.handleLogin()
    })
    .catch(err => {
      this.setState({
        error: true,
        loading: false
      })
    })
  }

  render(){
    return(
      <Split flex='right'>
        <Box size='medium' align='center'>
          {this.state.loading ?
            <Title>
              Iniciando Sesion
              <Spinning />
            </Title>
            :
            <LoginForm usernameType='text' onSubmit={this.handleLoginSubmit}/>
          }
          {this.state.error && <Title>Error al iniciar sesión</Title>}
        </Box>
        <Box colorIndex='neutral-2-a' full={true} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Image src={logo} size='large' style={{margin: '0px 20px 0px 20px'}}/>
        </Box>
      </Split>
    )
  }
}

export default Login