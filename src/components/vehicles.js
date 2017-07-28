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
    vehiclePlaca: '',
    vehicleModelo: '',
    vehicleColor: '',
    submitErrors: false,
    layerMode: 'new',
    vehicleId: ''
  }

  fetchVehicles = () => {
    axios.get('/api/vehicle')
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
      showLayer: false,
      layerMode: 'new',
      vehiclePlaca: '',
      vehicleModelo: '',
      vehicleColor: '',
      vehicleId: ''
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      placas: this.state.vehiclePlaca,
      modelo: this.state.vehicleModelo,
      color: this.state.vehicleColor
    }
    if(this.state.layerMode === 'new') {
      axios.post('/api/vehicle', data)
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
    } else {
      axios.put('/api/vehicle/' + this.state.vehicleId, data)
      .then(res => {
        if(res.data.errors){
          console.log(res.data.errors)
          this.setState({
            submitErrors: true
          })
        } else {
          this.setState({
            showLayer: false,
            layerMode: 'new',
            vehiclePlaca: '',
            vehicleModelo: '',
            vehicleColor: '',
            vehicleId: ''
          }, () => {
            this.fetchVehicles()
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  hanldeInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  handleEdit = (vehicle) => {
    this.setState(() => (
      {
        vehicleColor: vehicle.color,
        vehicleModelo: vehicle.modelo,
        vehiclePlaca: vehicle.placas,
        vehicleId: vehicle._id,
        layerMode: 'edit',
        showLayer: true
      }
    ))
  }

  render(){
    return(
      <Box align='center'>
        { this.state.showLayer && 
          <Layer onClose={this.handleLayerClose} closer>
            <Form pad='medium'>
              <Header>
                <Heading>{this.state.layerMode === 'new' ? 'Nuevo':'Editar'} Vehículo</Heading>
              </Header>
              <FormField label='Placas'>
                <TextInput name='vehiclePlaca' onDOMChange={this.hanldeInputChange} value={this.state.vehiclePlaca} />
              </FormField>
              <FormField label='Modelo'>
                <TextInput name='vehicleModelo' onDOMChange={this.hanldeInputChange} value={this.state.vehicleModelo}/>
              </FormField>
              <FormField label='Color'>
                <TextInput name='vehicleColor' onDOMChange={this.hanldeInputChange} value={this.state.vehicleColor}/>
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
              <th>
                Editar
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
                  <td><Button label='editar' onClick={() => this.handleEdit(vehicle) } /></td>
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
