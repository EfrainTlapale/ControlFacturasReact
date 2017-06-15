import React, {Component} from 'react'

import Form from 'grommet/components/Form'
import Heading from 'grommet/components/Heading'
import Header from 'grommet/components/Header'
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

import {Prompt} from 'react-router-dom'

class NewBill extends Component {
  state = {
    modified: false,
    date: '',
    selectOption: '',
    provider: '',
    concepts: [
      {id: 1, units: 0, unitType: '', description: '', unitPrice: 0, total: 0}
    ]
  }
  handleSelect = ({option}) => {
    this.setState({
      selectOption: option,
      provider: option  
    })
  }

  handleNewConcept = () => {
    const newField = this.state.concepts.concat([{id: this.state.concepts.length + 1 , units: 0, unitType: '', description: '', unitPrice: 0, total: 0}])
    this.setState({
      concepts: newField
    })  
  }

  hanldeInputChange = (e) => {
    if(!this.state.modified){
      this.setState({
        modified: true
      })
    }
    this.setState({
      concepts: this.state.concepts.map(concept => {
        if(''+concept.id !== e.target.id) return concept
        return {...concept, [e.target.name]: e.target.value}
      })
    })
  }

  logDate = (e) => {
    console.log(e)
    this.setState({
      date: e
    })
  }

  render(){
    const fields = this.state.concepts.map(fieldSet => {
      return (
        <div> 
          <Title>{'Concepto ' + fieldSet.id}</Title>
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
    })
    const total = this.state.concepts.reduce((total, concept) => {
      return total + (concept.unitPrice * concept.units)
    }, 0)
    return(
      <Box align='center'> 

        <Prompt message='No se han guardado los cambios, ¿seguro que desea salir?' when={this.state.modified}/>
        <Form>
            <Heading align='center'>
              Alta Factura
            </Heading>
            <br/>
          <FormField label='Proveedor'>
            <Select options={['proveedor 1', 'proveedor 2']} value={this.state.selectOption} onChange={this.handleSelect} />
          </FormField>
          <FormField label='Fecha'>
            <DateTime format='D/M/YYYY' onChange={this.logDate} value={this.state.date}/>
          </FormField>
          <br/>
          {fields}
          <Button onClick={this.handleNewConcept} label='Agregar Concepto' />
          <br/><br/>
          <Title>{'Total: ' + total}</Title>
          <Footer pad={{"vertical": "medium"}}>
            <Button label='Guardar'
              type='submit'
              primary={true}
              onClick={(e) => {e.preventDefault();console.log(this.state.provider)}}
            />
          </Footer>
        </Form>
      </Box>
    )
  }
}

export default NewBill
