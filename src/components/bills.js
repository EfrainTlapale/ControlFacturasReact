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
    facturas: [],
    error: false,
    opcionesProveedor: [],
    opcionesVehiculo: [],
    vehiculoSeleccionado: 'Todos',
    proveedorSeleccionado: 'Todos',
    fecha: this.getDate()
  }
  componentDidMount() {
    this.fetchProviders()
    this.fetchVehicles()
    axios.get('/api/factura')
    .then(({data}) => {
      this.setState(() => ({facturas: data}))
    })
    .catch(err => {
      this.setState({
        error: true
      })
    })
  }

  fetchProviders = () => {
    axios.get('/api/proveedor')
    .then(({data}) => {
      this.setState({
        opcionesProveedor: data
      })
    })
  }

  fetchVehicles = () => {
    axios.get('/api/vehiculo')
    .then(({data}) => {
      this.setState({
        opcionesVehiculo: data
      })
    })
  }

  handleProviderSelect = ({option}) => {
    this.setState({
      proveedorSeleccionado: option
    })
  }

  handleVehicleSelect = ({option}) => {
    this.setState({
      vehiculoSeleccionado: option
    })
  }

  filteredFacturas = () => {
    const facturas = this.state.facturas.filter(factura => {
      const date = new Date(factura.fecha)
      return `${date.getMonth()+1}/${date.getFullYear()}` === this.state.fecha
    })
    if(this.state.proveedorSeleccionado === 'Todos' && this.state.vehiculoSeleccionado==='Todos'){
      return facturas
    } else {
      return facturas.filter(factura => {
        let ok = true
        if(this.state.proveedorSeleccionado !== 'Todos'){
          ok = factura.proveedor.nombre === this.state.proveedorSeleccionado
        }
        if(this.state.vehiculoSeleccionado !=='Todos'){
          if(ok){
            if(factura.vehiculo){
              const vehiculo = factura.vehiculo
              ok = `${vehiculo.modelo} ${vehiculo.color} ${vehiculo.placas}` === this.state.vehiculoSeleccionado
            } else {
              ok = false
            }
          } 
        }
        return ok 
      })
    }
  }

  filteredProveedorOptions = () => {
    const options = this.state.opcionesProveedor.map(opt => opt.nombre)
    options.unshift('Todos')
    return options
  }

  filteredVehiculoOptions = () => {
    const options = this.state.opcionesVehiculo.map(opt => `${opt.modelo} ${opt.color} ${opt.placas}`)
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
            <Select options={this.filteredProveedorOptions()} onChange={this.handleProviderSelect} value={this.state.proveedorSeleccionado} />
          </FormField>
          <FormField label='Vehículo'>
            <Select options={this.filteredVehiculoOptions()} onChange={this.handleVehicleSelect} value={this.state.vehiculoSeleccionado}/>
          </FormField>
          <FormField label='Mes/Año'>
            <DateTime format='M/YYYY' value={this.state.date} onChange={this.handleDate}/>
          </FormField>
        </Columns>
        <Table>
          <thead>
            <tr>
              <th>
                Folio
              </th>
              <th>
                Fecha
              </th>
              <th>
                Proveedor
              </th>
              <th>
                Concepto
              </th>
              <th>
                Vehículo
              </th>
              <th>
                Total
              </th>
              <th>
                Editar
              </th>
            </tr>
          </thead>
          <tbody>
            {this.filteredFacturas().map((factura) => {
              return(
                <TableRow key={factura._id}>
                  <td>{factura.folio}</td>
                  <td>{moment(factura.fecha).format('LL')}</td>
                  <td>{factura.proveedor.nombre}</td>
                  <td>{factura.concepto}</td>
                  <td>{factura.vehiculo ? `${factura.vehiculo.modelo} ${factura.vehiculo.color} ${factura.vehiculo.placas}` : 'No aplica'}</td>
                  <td>${numeral(factura.total).format('0,0')}</td>
                  <td><Link to={'/editarFactura/' + factura._id} style={{textDecoration: 'none', color: 'white'}}><Box colorIndex='brand' align='center' style={{borderRadius: '10px'}}>Editar</Box></Link></td>
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
