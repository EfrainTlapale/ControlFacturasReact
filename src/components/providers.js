import React, {Component} from 'react'
import Box from 'grommet/components/Box'
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Heading from 'grommet/components/Heading'
import Layer from 'grommet/components/Layer'
import Button from 'grommet/components/Button'
import Form from 'grommet/components/Form'
import Header from 'grommet/components/Header'
import Footer from 'grommet/components/Footer'
import FormField from 'grommet/components/FormField'
import TextInput from 'grommet/components/TextInput'
import Title from 'grommet/components/Title'

import axios from 'axios'

class Providers extends Component {
  state = {
    providers: [],
    showLayer: false,
    newProviderRfc: '',
    newProviderDomicilio: '',
    newProviderNombre: '',
    submitErrors: false
  }

  fetchProviders = () => {
    axios.get('/api/provider')
    .then(res => {
      this.setState({
        providers: res.data
      })
    })
  }

  componentDidMount(){
    this.fetchProviders()
  }

  handleNewProvider = () => {
    this.setState({
      showLayer: true
    })
  }

  handleLayerClose = () => {
    this.setState({
      showLayer: false
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    axios.post('/api/provider', {
      rfc: this.state.newProviderRfc,
      nombre: this.state.newProviderNombre,
      domicilioFiscal: this.state.newProviderDomicilio
    })
    .then(res => {
      if(res.data.errors){
        console.log(res.data.errors)
        this.setState({
          submitErrors: true
        })
      } else {
        this.setState({
          showLayer: false
        }, () => {
          this.fetchProviders()
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
    console.log(this.state.newProviderRfc, this.state.newProviderDomicilio, this.state.newProviderNombre)
  }

  hanldeInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render(){
    return(
      <Box align='center'>
        { this.state.showLayer && 
          <Layer onClose={this.handleLayerClose}>
            <Form pad='medium'>
              <Header>
                <Heading>Nuevo Proveedor</Heading>
              </Header>
              <FormField label='RFC'>
                <TextInput name='newProviderRfc' onDOMChange={this.hanldeInputChange}/>
              </FormField>
              <FormField label='Nombre'>
                <TextInput name='newProviderNombre' onDOMChange={this.hanldeInputChange}/>
              </FormField>
              <FormField label='Domicilio Fiscal'>
                <TextInput name='newProviderDomicilio' onDOMChange={this.hanldeInputChange}/>
              </FormField>
              <Footer>
                <Button type='submit' label='Guardar' onClick={this.handleSubmit}/>
              </Footer>
              {this.state.submitErrors && <Title>Error al registrar</Title>}
            </Form>
          </Layer>
        }
        <Heading>Proveedores</Heading>
        <Button label='agregar proveedor' onClick={this.handleNewProvider}/>
        <Table>
          <thead>
            <tr>
              <th>
                RFC
              </th>
              <th>
                Nombre
              </th>
              <th>
                Domicilio Fiscal
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.providers.map((provider) => {
              return(
                <TableRow key={provider._id}>
                  <td>{provider.rfc}</td>
                  <td>{provider.nombre}</td>
                  <td>{provider.domicilioFiscal}</td>
                </TableRow>
              )
            })}
          </tbody>
        </Table>
      </Box>
    )
  }
}

export default Providers