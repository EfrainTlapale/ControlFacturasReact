import React, {Component} from 'react'
import Split from 'grommet/components/Split'
import Box from 'grommet/components/Box'
import LoginForm from 'grommet/components/LoginForm'

class Login extends Component{
  render(){
    return(
      <Split flex='right'>
        <Box size='medium'>
          <LoginForm align='center' usernameType='text' onSubmit={this.props.handleLogin}/>
        </Box>
        <Box colorIndex='neutral-2-a' full={true}>
        </Box>
      </Split>
    )
  }
}

export default Login