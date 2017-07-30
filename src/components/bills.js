import React, {Component} from 'react'
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import Select from 'grommet/components/Select'
import Columns from 'grommet/components/Columns'
import FormField from 'grommet/components/FormField'
import DateTime from 'grommet/components/DateTime'

import {Link} from 'react-router-dom'

import axios from 'axios'
import numeral from 'numeral'
import moment from 'moment'
moment.locale('es')

class Bills extends Component {

  getDate = () => {
    const now = new Date()
    return `${now.getMonth()+1}/${now.getFullYear()}`
  }

  state = {
    bills: [],
    error: false,
    providerOptions: [],
    vehicleOptions: [],
    selectedVehicle: 'Todos',
    selectedProvider: 'Todos',
    date: this.getDate()
  }
  componentDidMount() {
    this.fetchProviders()
    this.fetchVehicles()
    axios.get('/api/bill')
    .then(({data}) => {
      this.setState(() => ({bills: data}))
    })
    .catch(err => {
      this.setState({
        error: true
      })
    })
  }

  fetchProviders = () => {
    axios.get('/api/provider')
    .then(({data}) => {
      this.setState({
        providerOptions: data
      })
    })
  }

  fetchVehicles = () => {
    axios.get('/api/vehicle')
    .then(({data}) => {
      this.setState({
        vehicleOptions: data
      })
    })
  }

  handleProviderSelect = ({option}) => {
    this.setState({
      selectedProvider: option
    })
  }

  handleVehicleSelect = ({option}) => {
    this.setState({
      selectedVehicle: option
    })
  }

  filteredData = () => {
    const bills = this.state.bills.filter(bill => {
      const date = new Date(bill.date)
      return `${date.getMonth()+1}/${date.getFullYear()}` === this.state.date
    })
    if(this.state.selectedProvider === 'Todos' && this.state.selectedVehicle==='Todos'){
      return bills
    } else {
      return bills.filter(bill => {
        let ok = true
        if(this.state.selectedProvider !== 'Todos'){
          ok = bill.provider.nombre === this.state.selectedProvider
        }
        if(this.state.selectedVehicle !=='Todos'){
          if(ok){
            if(bill.vehicle){
              const vehicle = bill.vehicle
              ok = `${vehicle.modelo} ${vehicle.color} ${vehicle.placas}` === this.state.selectedVehicle
            } else {
              ok = false
            }
          } 
        }
        return ok 
      })
    }
  }

  filteredProviderOptions = () => {
    const options = this.state.providerOptions.map(opt => opt.nombre)
    options.unshift('Todos')
    return options
  }

  filteredVehicleOptions = () => {
    const options = this.state.vehicleOptions.map(opt => `${opt.Modelo} ${opt.Color} ${opt.Placas}`)
    options.unshift('Todos')
    return options
  }

  handleDate = (date) => {
    this.setState(() => ({date}))
  }

  render(){
    return( 
      <Box align='center'>
        <Heading>Facturas</Heading>
        <Columns justify='center' size='small'>
          <FormField label='Proveedor'>
            <Select options={this.filteredProviderOptions()} onChange={this.handleProviderSelect} value={this.state.selectedProvider} />
          </FormField>
          <FormField label='Vehículo'>
            <Select options={this.filteredVehicleOptions()} onChange={this.handleVehicleSelect} value={this.state.selectedVehicle}/>
          </FormField>
          <FormField label='Mes/Año'>
            <DateTime format='M/YYYY' value={this.state.date} onChange={this.handleDate}/>
          </FormField>
        </Columns>
        <Table>
          <thead>
            <tr>
              <th>
                Proveedor
              </th>
              <th>
                Total
              </th>
              <th>
                Fecha
              </th>
              <th>
                Vehículo
              </th>
              <th>
                Detalles
              </th>
            </tr>
          </thead>
          <tbody>
            {this.filteredData().map((bill) => {
              return(
                <TableRow key={bill._id}>
                  {bill.provider ? <td>{bill.provider.nombre}</td>: <td>Ninguno</td>}
                  <td>${numeral(bill.total).format('0,0')}</td>
                  <td>{moment(bill.date).format('LL')}</td>
                  <td>{bill.vehicle ? `${bill.vehicle.modelo} ${bill.vehicle.color} ${bill.vehicle.placas}` : 'No aplica'}</td>
                  <td><Link to={'/factura/' + bill._id} style={{textDecoration: 'none', color: 'white'}}><Box colorIndex='brand' align='center' style={{borderRadius: '10px'}}>Ver Detalles</Box></Link></td>
                </TableRow>
              ) 
            })}
          </tbody>
        </Table>
      </Box> 
    )
  }
}

export default Bills
