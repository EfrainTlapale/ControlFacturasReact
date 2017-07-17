import React, {Component, PropTypes} from 'react'

import Form from 'grommet/components/Form'
import FormField from 'grommet/components/FormField'
import Footer from 'grommet/components/Footer'
import Button from 'grommet/components/Button'
import Box from 'grommet/components/Box'
import Select from 'grommet/components/Select'
import TextInput from 'grommet/components/TextInput'
import Columns from 'grommet/components/Columns'
import Title from 'grommet/components/Title'
import NumberInput from 'grommet/components/NumberInput'
import DateTime from 'grommet/components/DateTime'
import Toast from 'grommet/components/Toast'
import CloseIcon from 'grommet/components/icons/base/Close'
import Checkbox from 'grommet/components/CheckBox'

import {Prompt} from 'react-router-dom'
import axios from 'axios'

class BillForm extends Component {
  state = {
    modified: false,
    date: '',
    selectedProvider: '',
    providerID: '',
    selectedVehicle: '',
    vehicleID: '',
    concepts: [
      {id: 1, units: 0, unitType: '', description: '', unitPrice: 0, total: 0}
    ],
    providerOptions: [],
    vehicleOptions: [],
    showToast: false,
    toastStatus: 'ok',
    toastMessage: 'Guardado con éxito',
    isForVehicle: false
  }

  componentDidMount(){
    this.fetchProviders()
    this.fetchVehicles()
  }
  
  componentWillReceiveProps(nextProps) {
    if(nextProps.billData){
      const {date, provider, concepts, vehicle} = nextProps.billData
      const vehicleState = vehicle ? {
        selectedVehicle: `${vehicle.modelo} ${vehicle.color} ${vehicle.placas}`,
        vehicleID: vehicle._id,
        isForVehicle: true
      }:null
      const state = Object.assign({date, selectedProvider: provider.nombre, providerID: provider._id, concepts: concepts.map((concept, i) => Object.assign(concept, {id: i}))}, vehicle ? vehicleState:null)
      this.setState(() => state)
    }
  }

  handleProviderSelect = ({option}) => {
    this.checkModified()
    const id = this.state.providerOptions.find(opt => {
      return opt.nombre === option
    })._id
    this.setState({
      providerID: id,
      selectedProvider: option
    })
  }
  handleVehicleSelect = ({option}) => {
    this.checkModified()
    const id = this.state.vehicleOptions.find(opt => {
      return `${opt.modelo} ${opt.color} ${opt.placas}` === option
    })._id
    this.setState({
      vehicleID: id,
      selectedVehicle: option
    })
  }

  handleNewConcept = () => {
    const lenght = this.state.concepts.length
    let id = lenght === 0 ? 1:this.state.concepts[lenght-1].id
    const newField = this.state.concepts.concat([{id: id + 1 , units: 0, unitType: '', description: '', unitPrice: 0, total: 0}])
    this.setState(() => ({concepts: newField}))
  }

  handleRemoveConcept = (conceptId) => {
    this.setState(prevState => ({concepts: prevState.concepts.filter(con => con.id !== conceptId)}))
  }

  hanldeInputChange = (e) => {
    this.checkModified()
    this.setState({
      concepts: this.state.concepts.map(concept => {
        if(''+concept.id !== e.target.id) return concept
        return {...concept, [e.target.name]: e.target.value}
      })
    })
  }

  checkModified = () => {
    if(!this.state.modified){
      this.setState({
        modified: true
      })
    }
  }

  handleDate = (e) => {
    this.checkModified()
    this.setState({
      date: e
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
    axios.get('/api/vehicles')
    .then(({data}) => {
      this.setState({
        vehicleOptions: data
      })
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      provider: this.state.providerID,
      concepts: this.state.concepts,
      total: this.getTotal(),
      date: new Date(this.state.date)
    }
    const newData = Object.assign(data, this.state.isForVehicle ? {vehicle: this.state.vehicleID}: null)
    this.props.onSubmit.bind(this)(newData)
  }

  handleToastClose = () => {
    this.setState({
      showToast: false
    })
  }

  handleCheckBox = () => {
    const {modelo, color, placas, _id} = this.state.vehicleOptions[0]
    this.setState(({isForVehicle}) => ({isForVehicle: !isForVehicle, selectedVehicle: `${modelo} ${color} ${placas}`, vehicleID: _id}))
  }

  getTotal = () => {
    const total = this.state.concepts.reduce((total, concept) => {
      return total + (concept.unitPrice * concept.units)
    }, 0)
    return total
  }

  render(){
    return(
      <Box align='center'>
        {this.state.showToast && <Toast status={this.state.toastStatus} onClose={this.handleToastClose}>{this.state.toastMessage}</Toast>}
        <Prompt message='No se han guardado los cambios, ¿seguro que desea salir?' when={this.state.modified}/>
        <Form>
            <br/>
          <FormField label='Proveedor'>
            <Select options={this.state.providerOptions.map(opt => opt.nombre)} value={this.state.selectedProvider} onChange={this.handleProviderSelect} />
          </FormField>
          <FormField label='Fecha'>
            <DateTime format='M/D/YYYY' onChange={this.handleDate} value={this.state.date}/>
          </FormField>
          <FormField>
            <Checkbox label='Pertenece a Vehículo' checked={this.state.isForVehicle} onChange={this.handleCheckBox}/>
          </FormField>
          { this.state.isForVehicle && 
            <FormField label='Vehículo'>
              <Select disabled={true} options={this.state.vehicleOptions.map(opt => `${opt.modelo} ${opt.color} ${opt.placas}`)} value={this.state.selectedVehicle} onChange={this.handleVehicleSelect} />
            </FormField>
          }
          <br/>
          {this.state.concepts.map(fieldSet => {
            return (
              <div key={fieldSet.id}> 
                <Columns size={'small'} justify='between'>
                  <Title>{'Concepto '}</Title>
                  <Box align='end'>
                    <Button onClick={() => this.handleRemoveConcept(fieldSet.id)}>
                      <CloseIcon />
                    </Button>
                  </Box>
                </Columns>
                <br/>
                <Columns size={'small'} justify='between' >
                  <FormField label='Cantidad' >
                    <NumberInput value={fieldSet.units} id={'' + fieldSet.id} name='units' onChange={this.hanldeInputChange}/>
                  </FormField>
                  <FormField label='Unidad de Medida'>
                    <TextInput value={fieldSet.unitType} id={'' + fieldSet.id} name='unitType' onDOMChange={this.hanldeInputChange}/>
                  </FormField>
                </Columns>
                <FormField label='descripcion' >
                  <TextInput value={fieldSet.description} id={'' + fieldSet.id} name='description' onDOMChange={this.hanldeInputChange} />
                </FormField>
                <FormField label='Precio Unitario'>
                  <NumberInput value={fieldSet.unitPrice} id={'' + fieldSet.id} name='unitPrice' onChange={this.hanldeInputChange}/>
                </FormField>
                <FormField label={'Importe ' + (fieldSet.unitPrice * fieldSet.units)}> 
                </FormField>
                <br/>
              </div>
            )
          })}
          <Button onClick={this.handleNewConcept} label='Agregar Concepto' />
          <br/><br/>
          <Title>{'Total: ' + this.getTotal()}</Title>
          <Footer pad={{"vertical": "medium"}}>
            <Button label='Guardar'
              type='submit'
              primary={true}
              onClick={this.handleSubmit}
            />
          </Footer>
        </Form>
      </Box>
    )
  }
}

BillForm.propTypes = {
  onSubmit: PropTypes.func.isRequired
}

export default BillForm
