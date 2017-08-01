import React, {Component} from 'react'
import Meter from 'grommet/components/Meter'
import Box from 'grommet/components/Box'
import Value from 'grommet/components/Value'
import Label from 'grommet/components/Label'
import Title from 'grommet/components/Title'
import DateTime from 'grommet/components/DateTime'
import FormField from 'grommet/components/FormField'
import NumberInput from 'grommet/components/NumberInput'
import Button from 'grommet/components/Button'

import numeral from 'numeral'
import axios from 'axios'
import moment from 'moment'
import decode from 'jwt-decode'

class Main extends Component {
  getDate = () => {
    const now = new Date()
    return `${now.getMonth()+1}/${now.getFullYear()}`
  }

  state = {
    total: 0,
    err: false,
    techo: 1,
    period: this.getDate(),
    techoExist: false,
    techoInput: '0',
    userRole: ''
  }

  componentDidMount() {
    this.setState(() => ({userRole: decode(localStorage.getItem('jwt'))._doc.rol}))
    this.fetchTecho(this.state.period)
    this.getBillsFilteredTotal()
  }

  getBillsFilteredTotal = () => {
    axios.get('/api/factura')
    .then(({data}) => {
      const total = data.reduce((total, factura) => {
        const date = new Date(factura.fecha)
        if (`${date.getMonth()+1}/${date.getFullYear()}` === this.state.period) {
          return total + +factura.total
        } else {
          return total + 0
        }
      }, 0)
      this.setState(() => ({total}))
    })
    .catch(err => {
      this.setState(() => ({err: true}))
    })
  }

  onSelectChange = (period) => {
    this.fetchTecho(period)
    this.setState(() => ({period}))
    this.getBillsFilteredTotal()
  }

  fetchTecho = (period) => {
    axios.get('/api/techo/' + period.replace('/', '-'))
    .then(({data}) => {
      if (data.techo) {
        this.setState(() => ({techo: data.techo.monto, techoExist: true}))
      } else {
        this.setState(() => ({techoExist: false}))
      }
    })
    .catch(err => console.log(err))
  }

  onNumberChange = (e) => {
    const number = e.target.value
    this.setState(() => ({techoInput: number}))
  }

  techoSubmit = () => {
    axios.post('/api/techo', {periodo: this.state.period.replace('/', '-'), monto: this.state.techoInput})
    .then(({data}) => {
      this.setState(() => ({techoExist: true, techo: this.state.techoInput, techoInput: '0'}))
    })
    .catch(err => console.log(err))
  }

  getPercentaje = () => {
    return ((this.state.total * 100) / this.state.techo)
  }

  render () {
    return (
      <Box align='center'>
        <h1 style={{marginTop:'40px'}}>Techo Presupuestal</h1>
        <Box>
          {this.state.techoExist && 
          <Value value={this.getPercentaje()}
            units='%'
            align='start'
            size='large'/>}
          <FormField style={{marginTop: '30px', marginBottom: '30px'}}>
            <DateTime format='M/YYYY' onChange={this.onSelectChange} value={this.state.period}/>
          </FormField>
          
          {this.state.techoExist ?
            <Box>
              <Title>
                ${numeral(this.state.total).format('0,0')}
              </Title>
              <Meter vertical={false}
                size='large'
                value={this.getPercentaje()}
                colorIndex='neutral-1' />
              <Box direction='row'
                justify='between'
                pad={{"between": "small"}}
                responsive={false}>
                <Label size='small'>
                  $0
                </Label>
                <Label size='small'>
                  ${numeral(this.state.techo).format('0,0')}
                </Label>
              </Box>
            </Box>
            :
            <div>
              <Title>
                No se ha asignado el techo presupuestal
              </Title>
              <Title>
                para el periodo {moment('01/' + this.state.period, 'DD-MM-YYYY').format('MMMM YYYY')}
              </Title>
              <br/>
              {this.state.userRole === 'director' ? 
                <Box>
                  <FormField>
                    <NumberInput id='inputTecho' value={this.state.techoInput} onChange={this.onNumberChange} />
                  </FormField>
                  <Button label='Asignar' onClick={this.techoSubmit}/>
                </Box>
                :
                <Title>
                  Contacte al director
                </Title>
              }
              
            </div>
          }
        </Box>
      </Box>
    )
  }
}

export default Main