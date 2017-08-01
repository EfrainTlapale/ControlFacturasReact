import React, { Component } from 'react'

import Box from 'grommet/components/Box'
import Heading from 'grommet/components/Heading'
import Select from 'grommet/components/Select'
import FormField from 'grommet/components/FormField'
import Columns from 'grommet/components/Columns'
import DateTime from 'grommet/components/DateTime'
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'

import axios from 'axios'

class LogBookVehicles extends Component {
  getDate = () => {
    const date = new Date()
    return `${date.getMonth()+1}/${date.getFullYear()}`
  }
  state = {
    vehiculos: [],
    facturas: [],
    fecha: this.getDate(),
    vehiculoSeleccionado: ''
  }

  componentDidMount() {
    this.fetchFacturas()
    this.fetchVehiculos()
  }

  fetchFacturas = () => {
    axios.get('/api/factura')
    .then(({data}) => {
      this.setState(() => ({
        facturas: data
      }))
    })
    .catch(err => console.log(err.response))
  }

  fetchVehiculos = () => {
    axios.get('/api/vehiculo')
    .then(({data}) => {
      this.setState(() => ({
        vehiculos: data
      }))
    })
    .catch(err => console.log(err.response))
  }

  getOptions = () => {
    return this.state.vehiculos.map(opt => `${opt.modelo} ${opt.color} ${opt.placas}`)
  }

  handleDate = (fecha) => {
    this.setState(()=>({
      fecha
    }))
  }

  handleSelect = ({value}) => {
    this.setState(() => ({
      vehiculoSeleccionado: value
    }))
  }

  filteredFacturas = () => {
    const facturas = this.state.facturas.filter(factura => {
      if(factura.vehiculo){
        const date = new Date(factura.fecha)
        const {modelo, color, placas} = factura.vehiculo
        return `${date.getMonth()+1}/${date.getFullYear()}` === this.state.fecha && `${modelo} ${color} ${placas}` === this.state.vehiculoSeleccionado
      } else {
        return false
      }
    })
    return facturas.reduce((arr, factura, i) => {
      if(i === 0){
        arr[i]['acomuladoAnterior'] = 0
        arr[i]['acomuladoActual'] = factura.total
      } else {
        arr[i].acomuladoAnterior = arr[i-1].acomuladoActual
        arr[i].acomuladoActual = arr[i].acomuladoAnterior + factura.total
      }
      return arr
    }, facturas)
  }

  render() {
    return (
      <Box align='center'>
        <Heading>Bitácora Vehículos</Heading>
        <Columns justify='center' size='medium'>
          <FormField label='Vehículo'>
            <Select options={this.getOptions()} value={this.state.vehiculoSeleccionado} onChange={this.handleSelect}/>
          </FormField>
          <FormField label='Mes'>
            <DateTime format='M/YYYY' value={this.state.fecha} onChange={this.handleDate}/>
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
                Refacciones
              </th>
              <th>
                Acomulado Mes Anterior
              </th>
              <th>
                Movimiento del Mes
              </th>
              <th>
                Acomulado Actual
              </th>
            </tr>
          </thead>
          <tbody>
            {this.filteredFacturas().map(({acomuladoAnterior, acomuladoActual, _id, folio, fecha, proveedor, concepto, refacciones, total}, i, arr) => {
              return(
                <TableRow key={_id}>
                  <td>{folio}</td>
                  <td>{fecha}</td>
                  <td>{proveedor.nombre}</td>
                  <td>{concepto}</td>
                  <td>{refacciones || 'Ninguna'}</td>
                  <td>{acomuladoAnterior}</td>
                  <td>{total}</td>
                  <td>{acomuladoActual}</td>
                </TableRow>
              )}
            )}
          </tbody>
        </Table>
      </Box>
    )
  }
}

export default LogBookVehicles