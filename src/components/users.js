import React, { Component } from 'react'

import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Heading from 'grommet/components/Heading'
import Header from 'grommet/components/Header'
import FormField from 'grommet/components/FormField'
import Layer from 'grommet/components/Layer'
import Form from 'grommet/components/Form'
import Title from 'grommet/components/Title'
import TextInput from 'grommet/components/TextInput'
import Footer from 'grommet/components/Footer'
import Button from 'grommet/components/Button'
import Box from 'grommet/components/Box'
import Select from 'grommet/components/Select'

import axios from 'axios'

class Users extends Component {
  state = {
    users: [],
    showLayer: false,
    newUserSelectedRole: '',
    newUserNombre: '',
    newUserUsuario: '',
    newUserPassword: '',
    errors: false
  }

  componentDidMount() {
    this.fetchUsers()
  }

  hanldeInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleSelectChange = (e) => {
    this.setState(() => ({newUserSelectedRole: e.value}))
  }

  handleUserSubmit = (e) => {
    e.preventDefault()
    const data = {
      username: this.state.newUserUsuario,
      name: this.state.newUserNombre,
      password: this.state.newUserPassword,
      role: this.state.newUserSelectedRole
    }
    axios.post('/api/signup', data)
    .then(res => {
      if (res.data.err) {
        console.log(data)
        console.log(res.data.err)
        this.setState(() => ({errors: true}))
      } else {
        this.setState(() => ({
          showLayer: false,
          newUserSelectedRole: '',
          newUserNombre: '',
          newUserUsuario: '',
          newUserPassword: '',
          errors: false
        }))
        this.fetchUsers()
      }
    })
    .catch(err => {
      console.log('err here 2')
      console.log(err)
    })
  }

  fetchUsers = () => {
    axios.get('/api/users')
    .then(({data}) => {
      if(data.err){
        console.log(data.err)
      } else {
        this.setState(() => ({users: data.users}))
      }
    })
  }

  handleLayer = () => {
    this.setState(() => ({showLayer: !this.state.showLayer}))
  }

  render() {
    return (
      <Box align='center'>
        { this.state.showLayer && 
          <Layer onClose={this.handleLayer} closer>
            <Form pad='medium'>
              <Header>
                <Heading>Nuevo Usuario</Heading>
              </Header>
              <FormField label='Usuario'>
                <TextInput name='newUserUsuario' onDOMChange={this.hanldeInputChange}/>
              </FormField>
              <FormField label='Nombre'>
                <TextInput name='newUserNombre' onDOMChange={this.hanldeInputChange}/>
              </FormField>
              <FormField label='Rol'>
                <Select options={['director', 'auxiliar']} value={this.state.newUserSelectedRole} name='newUserRol' onChange={this.handleSelectChange}/>
              </FormField>
              <FormField label='Contraseña'>
                <TextInput name='newUserPassword' onDOMChange={this.hanldeInputChange}/>
              </FormField>
              <br/>
              <Footer>
                <Button type='submit' label='Guardar' onClick={this.handleUserSubmit}/>
              </Footer>
              {this.state.errors && <Title>Error al registrar usuario</Title>}
            </Form>
          </Layer>
        }
        <Heading>Usuarios</Heading>
        <Button label='Agregar Usuario' onClick={this.handleLayer}/>
        <Table>
          <thead>
            <tr>
              <th>
                Usuario
              </th>
              <th>
                Nombre
              </th>
              <th>
                Rol
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((user) => {
              return(
                <TableRow key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                </TableRow>
              )
            })}
          </tbody>
        </Table>
      </Box>
    )
  }
}

export default Users
