import React, {Component} from 'react'
import PropTypes from 'prop-types'

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

class Crud extends Component {
  constructor(props){
    super(props)
    const fields = this.props.fields.reduce((o, f) => {
      o[f] = ''
      return o
    }, {})
    this.state = {
      data: [],
      showLayer: false,
      submitErrors: false,
      layerMode: 'new',
      resourceId: '',
      fields
    }
  }

  fetchData = () => {
    axios.get('/api/' + this.props.resource)
    .then(({data}) => {
      this.setState({
        data
      })
    })
    .catch(err => console.log(err))
  }

  componentDidMount(){
    this.fetchData()
  }

  handleNewElement = () => {
    this.setState({
      showLayer: true
    })
  }

  getCleanFields = () => {
    const cleanFields = this.props.fields.reduce((o, f) => {
      o[f] = ''
      return o
    }, {})
    return cleanFields
  }

  handleLayerClose = () => {
    
    this.setState({
      showLayer: false,
      layerMode: 'new',
      fields: this.getCleanFields(),
      resourceId: ''
    })
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const data = this.props.fields.reduce((o, f) => {
      o[f] = this.state.fields[f]
      return o
    }, {})
    if(this.state.layerMode === 'new') {
      axios.post('/api/' + this.props.resource, data)
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
            this.fetchData()
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    } else {
      axios.put(`/api/${this.props.resource}/${this.state.resourceId}`, data)
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
            fields: this.getCleanFields(),
            resourceId: ''
          }, () => {
            this.fetchData()
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  hanldeInputChange = (e) => {
    const fields = Object.assign(this.state.fields, {[e.target.name]: e.target.value})
    this.setState({
      fields
    })
  }

  handleEdit = (element) => {
    const editData = this.props.fields.reduce((o, f) => {
      o[f] = element[f]
      return o
    }, {})
    console.log(editData)
    this.setState(() => (
      {
        fields: editData,
        resourceId: element._id,
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
                <Heading>{this.state.layerMode === 'new' ? 'Nuevo':'Editar'} {this.props.resourceAlias || this.props.resource}</Heading>
              </Header>
              {this.props.fields.map((f, i) => (
                <FormField label={f} key={i}>
                  <TextInput name={f} onDOMChange={this.hanldeInputChange} value={this.state.fields[f]} />
                </FormField>
              ))}
              <Footer>
                <Button type='submit' label='Guardar' onClick={this.handleSubmit}/>
              </Footer>
              {this.state.submitErrors && <Title>Error al registrar</Title>}
            </Form>
          </Layer>
        }
        <Heading>{this.props.resourcePlural || this.props.resourceAlias}</Heading>
        <Button label={'Agregar ' + this.props.resourceAlias || this.props.resource}  onClick={this.handleNewElement}/>
        <Table>
          <thead>
            <tr>
              {this.props.fields.map((f, i) => (
                <th key={i}>{f}</th>
              ))}
              <th>
                Editar
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((element) => {
              return(
                <TableRow key={element._id}>
                  {this.props.fields.map((f, i) => (
                    <td key={i}> {element[f]} </td>
                  ))}
                  <td><Button label='editar' onClick={() => this.handleEdit(element) } /></td>
                </TableRow>
              )
            })}
          </tbody>
        </Table>
      </Box>
    )
  }
}

Crud.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  resource: PropTypes.string.isRequired,
  resourceAlias: PropTypes.string
}

class TestCrud extends Component {
  state = {  }
  render() {
    return (
      <Crud resource='provider' resourceAlias='Proveedor' resourcePlural='Proveedores' fields={['rfc', 'nombre', 'domicilioFiscal']} />
    )
  }
}

export default TestCrud
