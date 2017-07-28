import React, { Component } from 'react'

import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'
import Tiles from 'grommet/components/Tiles'
import Tile from 'grommet/components/Tile'
import Layer from 'grommet/components/Layer'
import Title from 'grommet/components/Title'

import axios from 'axios' 
import moment from 'moment'
import numeral from 'numeral'
import {Link, Redirect} from 'react-router-dom'

class ViewBill extends Component {
  state = {
    concepts: [],
    date: '',
    provider: {},
    total: 0,
    vehicle: {},
    loading: true,
    showLayer: false,
    redirect: false
   }
   componentDidMount() {
     const url = '/api/bill/' + this.props.match.params.id
     axios.get(url)
     .then(({data}) => {
       this.setState(() =>
       ({
          concepts: data.concepts,
          date: data.date,
          provider: data.provider,
          total: data.total,
          vehicle: data.vehicle,
          loading: false
        })
      )
     })
     .catch(err => console.log(err))
   }

   handleLayerClose = () => {
     this.setState(() => ({showLayer: false}))
   }

   handleShowLayer = () => {
    this.setState(() => ({showLayer: true}))
   }

   handleDelete = () => {
     axios.delete('/api/bill/' + this.props.match.params.id)
     .then(({data}) => {
       if(data.doc){
        this.props.handleShowToast('ok', 'eliminado con éxito')
        this.setState(() => ({redirect: true}))
       }
     })
     .catch(err => {
       console.log(err)
      })
   }
  
  render() {
    return (
      <Box margin='large'>
        {this.state.redirect && <Redirect to='/facturas' />}
        {this.state.showLayer && 
          <Layer closer onClose={this.handleLayerClose}>
            <Box size={{height: 'small', width: 'medium'}} align='center' alignContent='center' justify='center'>
              <Title>Seguro que desea elminiar</Title>
              <br/>
              <Box full='horizontal' colorIndex='ok' align='center' style={{borderRadius: '10px', color:'white'}} onClick={this.handleDelete}>Confirmar</Box>
              <br/>
              <Box full='horizontal' colorIndex='critical' align='center' style={{borderRadius: '10px'}} onClick={this.handleShowLayer}>Cancelar</Box>
            </Box>
          </Layer>
        }
        {this.state.loading ? <h3>Cargando</h3>:
        <div>
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
        <Tiles fill flush={false}>
          {this.state.concepts.map(concept => (
            <Tile key={concept.description} basis='1/3' pad={{vertical: 'large'}} margin='small' colorIndex='light-2'>
              <Heading align='center' tag='h3'><b>Descripcion</b>: {concept.description}</Heading>
              <Heading align='center' tag='h3'><b>Unidades</b>: {concept.unitType}</Heading>
              <Heading align='center' tag='h3'><b>Precio</b> Unitario: ${numeral(concept.unitPrice).format('0,0')}</Heading>
              <Heading align='center' tag='h3'><b>Unidades</b>: {concept.units}</Heading>
              <Heading align='center' tag='h3'><b>Total</b>: ${numeral(concept.units * concept.unitPrice).format('0,0')}</Heading>
            </Tile>
          ))}
        </Tiles>
        <Link to={'/editarfactura/' + this.props.match.params.id} style={{textDecoration: 'none', color: 'white'}}><Box colorIndex='brand' align='center' style={{borderRadius: '10px'}}>Editar</Box></Link>
        <br/>
        <Box colorIndex='critical' align='center' style={{borderRadius: '10px'}} onClick={this.handleShowLayer}>Eliminar</Box>
        </div>
        }
      </Box>
    )
  }
}

export default ViewBill