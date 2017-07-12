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

class Vehicles extends Component {
  state = {
    vehicles: [],
    showLayer: false,
    newVehiclePlaca: '',
    newVehicleModelo: '',
    newVehicleColor: '',
    submitErrors: false
  }

  fetchVehicles = () => {
    axios.get('/api/vehicles')
    .then(({data}) => {
      this.setState({
        vehicles: data
      })
    })
    .catch(err => console.log(err))
  }

  componentDidMount(){
    this.fetchVehicles()
  }

  handleNewVehicle = () => {
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
    axios.post('/api/vehicle', {
      placas: this.state.newVehiclePlaca,
      modelo: this.state.newVehicleModelo,
      color: this.state.newVehicleColor
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
          this.fetchVehicles()
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
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
              <FormField label='Placas'>
                <TextInput name='newVehiclePlaca' onDOMChange={this.hanldeInputChange}/>
              </FormField>
              <FormField label='Modelo'>
                <TextInput name='newVehicleModelo' onDOMChange={this.hanldeInputChange}/>
              </FormField>
              <FormField label='Color'>
                <TextInput name='newVehicleColor' onDOMChange={this.hanldeInputChange}/>
              </FormField>
              <Footer>
                <Button type='submit' label='Guardar' onClick={this.handleSubmit}/>
              </Footer>
              {this.state.submitErrors && <Title>Error al registrar</Title>}
            </Form>
          </Layer>
        }
        <Heading>Vehículos</Heading>
        <Button label='Agregar Vehículo' onClick={this.handleNewVehicle}/>
        <Table>
          <thead>
            <tr>
              <th>
                Placas
              </th>
              <th>
                Modelos
              </th>
              <th>
                Color
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.vehicles.map((vehicle) => {
              return(
                <TableRow key={vehicle._id}>
                  <td>{vehicle.placas}</td>
                  <td>{vehicle.modelo}</td>
                  <td>{vehicle.color}</td>
                </TableRow>
              )
            })}
          </tbody>
        </Table>
      </Box>
    )
  }
}

export default Vehicles
