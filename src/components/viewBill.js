import React, { Component } from 'react'

import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import Tiles from 'grommet/components/Tiles'
import Tile from 'grommet/components/Tile'

import axios from 'axios' 
import moment from 'moment'
import numeral from 'numeral'

class ViewBill extends Component {
  state = {
    concepts: [],
    date: '',
    provider: {},
    total: 0,
    vehicle: {}
   }
   componentDidMount() {
     const url = '/api/bill/' + this.props.match.params.id
     axios.get(url)
     .then(({data}) => {
       console.log(data)
       this.setState(
         {
           concepts: data.concepts,
           date: data.date,
           provider: data.provider,
           total: data.total,
           vehicle: data.vehicle
         })
     })
     .catch(err => console.log(err))
   }
  render() {
    return (
      <Box margin='large'>
        <Heading align='center'>Factura</Heading>
        <Heading align='center' tag='h3'>{moment(this.state.date).format('LL')}</Heading>
        <br/>
        <Heading align='center' tag='h2' strong>Proveedor</Heading>
        <Heading align='center' tag='h3'><b>Nombre:</b> {this.state.provider.nombre}</Heading>
        <Heading align='center' tag='h3'><b>Domicilio</b> fiscal: {this.state.provider.domicilioFiscal}</Heading>
        <Heading align='center' tag='h3'><b>RFC</b>: {this.state.provider.rfc}</Heading>
        <br/>
        <Heading align='center' tag='h2'><b>Total:</b> ${numeral(this.state.total).format('0,0')}</Heading>

        <br/>
        {this.state.vehicle && <Heading align='center' tag='h2'><b>Vehículo:</b> {`${this.state.vehicle.modelo} ${this.state.vehicle.color} ${this.state.vehicle.placas}`}</Heading>}
        {this.state.vehicle && <br/>}
        <Heading align='center' tag='h2' strong>Conceptos</Heading>
        <br/>
        <Tiles fill>
          {this.state.concepts.map(concept => (
            <Tile key={concept.description} basis='1/3' pad={{vertical: 'large'}}>
              <Heading align='center' tag='h3'><b>Descripcion</b>: {concept.description}</Heading>
              <Heading align='center' tag='h3'><b>Unidades</b>: {concept.unitType}</Heading>
              <Heading align='center' tag='h3'><b>Precio</b> Unitario: ${numeral(concept.unitPrice).format('0,0')}</Heading>
              <Heading align='center' tag='h3'><b>Unidades</b>: {concept.units}</Heading>
              <Heading align='center' tag='h3'><b>Total</b>: ${numeral(concept.units * concept.unitPrice).format('0,0')}</Heading>
            </Tile>
          ))}
        </Tiles>
      </Box>
    )
  }
}

export default ViewBill