import React, {Component} from 'react'
import PropTypes from 'prop-types'

import Form from 'grommet/components/Form'
import FormField from 'grommet/components/FormField'
import Footer from 'grommet/components/Footer'
import Button from 'grommet/components/Button'
import Box from 'grommet/components/Box'
import Select from 'grommet/components/Select'
import TextInput from 'grommet/components/TextInput'
import NumberInput from 'grommet/components/NumberInput'
import DateTime from 'grommet/components/DateTime'
import Toast from 'grommet/components/Toast'
import Checkbox from 'grommet/components/CheckBox'
import Heading from 'grommet/components/Heading'

import SaveIcon from 'grommet/components/icons/base/Save'
import CloseIcon from 'grommet/components/icons/base/Close'

import {Prompt, Redirect} from 'react-router-dom'
import axios from 'axios'
import moment from 'moment'

class BillForm extends Component {
  state = {
    redirect: false,
    modificado: false,
    folio: '',
    fecha: '',
    proveedorSelecionado: '',
    idProveedor: '',
    vehiculoSeleccionado: '',
    idVehiculo: '',
    refacciones: '',
    concepto: '',
    opcionesProveedor: [],
    opcionesVehiculo: [],
    total: 0,
    showToast: false,
    toastStatus: 'ok',
    toastMessage: 'Guardado con éxito',
    isForVehiculo: false,
    isForAlimentos: false
  }

  componentDidMount(){
    this.fetchProviders()
    this.fetchVehicles()
  }
  
  componentWillReceiveProps(nextProps) {
    if(nextProps.billData){
      const {folio, fecha, proveedor, concepto, vehiculo, total} = nextProps.billData
      const vehicleState = vehiculo ? {
        vehiculoSeleccionado: `${vehiculo.modelo} ${vehiculo.color} ${vehiculo.placas}`,
        idVehiculo: vehiculo._id,
        isForVehiculo: true
      }:null
      const state = Object.assign({folio, total, fecha: moment(fecha).format('MM/DD/YYYY'), proveedorSelecionado: proveedor.nombre, idProveedor: proveedor._id, concepto}, vehiculo ? vehicleState:null)
      this.setState(() => state)
    }
  }

  handleProviderSelect = ({option}) => {
    this.checkModified()
    const id = this.state.opcionesProveedor.find(opt => {
      return opt.nombre === option
    })._id
    this.setState({
      idProveedor: id,
      proveedorSelecionado: option
    })
  }
  handleVehicleSelect = ({option}) => {
    this.checkModified()
    const id = this.state.opcionesVehiculo.find(opt => {
      return `${opt.modelo} ${opt.color} ${opt.placas}` === option
    })._id
    this.setState({
      idVehiculo: id,
      vehiculoSeleccionado: option
    })
  }

  checkModified = () => {
    if(!this.state.modified){
      this.setState({
        modificado: true
      })
    }
  }

  handleDate = (e) => {
    this.checkModified()
    this.setState({
      fecha: e
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

  handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      folio: this.state.folio,
      proveedor: this.state.idProveedor,
      concepto: this.state.concepto,
      total: this.state.total,
      fecha: new Date(this.state.fecha),
      alimento: this.state.isForAlimentos
    }
    const newData = Object.assign(data, this.state.isForVehiculo ? {vehiculo: this.state.idVehiculo}: {vehiculo: null})
    const url = this.props.method === 'post' ? this.props.url : this.props.url + '/' + this.props.billData._id
    axios[this.props.method](url,newData)
    .then(({data}) => {
      if(data.errors) {
        this.setState({
          toastStatus: 'critical',
          toastMessage: 'Error al guardar factura, por favor verifique los datos',
          showToast: true
        })
      } else {
        this.setState({
          showToast: true,
          modificado: false,
          folio: '',
          fecha: '',
          proveedorSelecionado: '',
          idProveedor: '',
          vehiculoSeleccionado: '',
          idVehiculo: '',
          refacciones: '',
          concepto: '',
          total: 0,
          toastStatus: 'ok',
          toastMessage: 'Guardado con éxito',
          isForVehiculo: false,
          isForAlimentos: false
        })
        if(this.props.method === 'put'){
          this.setState(() => ({redirect: true}))
        }
      }
    })
    .catch(err => {
      this.setState({
        toastStatus: 'critical',
        toastMessage: 'Error en la aplicación',
        showToast: true
      })
    })
  }

  handleToastClose = () => {
    this.setState({
      showToast: false
    })
  }

  handleCheckBox = (e) => {
    if(e.target.name === 'checkBoxVehiculo'){
      if(!this.state.isForVehiculo){
        const {modelo, color, placas, _id} = this.state.opcionesVehiculo[0]
        this.setState(() => ({vehiculoSeleccionado: `${modelo} ${color} ${placas}`, idVehiculo: _id}))
      } else {
        this.setState(() => ({vehiculoSeleccionado: '', idVehiculo: ''}))
      }
      this.setState(({isForVehiculo}) => ({isForVehiculo: !isForVehiculo}))
    } else {
      this.setState(({isForAlimentos}) => ({isForAlimentos: !isForAlimentos}))
    }
  }

  handleInputChange = (e) => {
    this.checkModified()
    const field = e.target.name
    const value = e.target.value
    this.setState(() => ({
      [field]: value
    }))
  }

  handleNumberChange = (e) => {
    const field = e.target.name
    const value = e.target.value
    this.setState(() => ({
      [field]: +value
    }))
  }

  handleDelete = () => {
    axios.delete('/api/factura/' + this.props.billData._id)
    .then(({data}) => {
      if(data.errors) {
        this.setState({
          toastStatus: 'critical',
          toastMessage: 'Error al guardar factura, por favor verifique los datos',
          showToast: true
        })
      } else {
        this.setState(() => ({redirect: true}))
      }
    })
    .catch(err => {
      this.setState({
        toastStatus: 'critical',
        toastMessage: 'Error en la aplicación',
        showToast: true
      })
    })
  }

  render(){
    return(
      <Box align='center'>
      {this.state.redirect && <Redirect to='/facturas' />}
        <Heading align='center'>
            {this.props.title}
        </Heading>
        {this.state.showToast && <Toast status={this.state.toastStatus} onClose={this.handleToastClose}>{this.state.toastMessage}</Toast>}
        <Prompt message='No se han guardado los cambios, ¿seguro que desea salir?' when={this.state.modificado}/>
        <Form>
            <br/>
          <FormField label='Folio'>
            <TextInput name='folio' onDOMChange={this.handleInputChange} value={this.state.folio}/>
          </FormField>
          <FormField label='Proveedor'>
            <Select options={this.state.opcionesProveedor.map(opt => opt.nombre)} value={this.state.proveedorSelecionado} onChange={this.handleProviderSelect} />
          </FormField>
          <FormField label='Fecha'>
            <DateTime format='M/D/YYYY' onChange={this.handleDate} value={this.state.fecha}/>
          </FormField>
          <FormField>
            <Checkbox name='checkBoxVehiculo' label='Pertenece a Vehículo' checked={this.state.isForVehiculo} onChange={this.handleCheckBox}/>
          </FormField>
          { this.state.isForVehiculo && 
            <Box>
              <FormField label='Vehículo'>
                <Select options={this.state.opcionesVehiculo.map(opt => `${opt.modelo} ${opt.color} ${opt.placas}`)} value={this.state.vehiculoSeleccionado} onChange={this.handleVehicleSelect} />
              </FormField>
              <FormField label='Refacciones Adquiridas'>
                <TextInput name='refacciones' value={this.state.refacciones} onDOMChange={this.handleInputChange} />
              </FormField>
            </Box>
          }
          <FormField>
            <Checkbox name='checkBoxAlimentos' label='Pertenece a Alimentos' checked={this.state.isForAlimentos} onChange={this.handleCheckBox}/>
          </FormField>
          <br/>
          <FormField label='Concepto'>
            <TextInput name='concepto' onDOMChange={this.handleInputChange} value={this.state.concepto}/>
          </FormField>
          <FormField label='Total'>
            <NumberInput name='total' value={this.state.total} onChange={this.handleNumberChange}/>
          </FormField>
          <br/><br/>
          <Footer justify='between' pad={{"vertical": "medium"}}>
            <Button
              icon={<SaveIcon/>}
              label='Guardar'
              type='submit'
              primary={true}
              onClick={this.handleSubmit}
            />
            {this.props.method === 'put' && <Button type='button' icon={<CloseIcon/>} label='Eliminar' onClick={this.handleDelete}/>}
          </Footer>
        </Form>
      </Box>
    )
  }
}

BillForm.propTypes = {
  method: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired
}

export default BillForm
