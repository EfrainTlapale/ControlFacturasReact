import React, {Component} from 'react'
import Meter from 'grommet/components/Meter'
import Box from 'grommet/components/Box'
import Value from 'grommet/components/Value'
import Label from 'grommet/components/Label'
import Title from 'grommet/components/Title'

import numeral from 'numeral'
import axios from 'axios'

class Main extends Component {
  state = {
    total: 0,
    err: false,
    techo: 100000
  }

  componentDidMount() {
    axios.get('/api/bill')
    .then(({data}) => {
      const total = data.reduce((total, bill) => {
        return total + +bill.total
      }, 0)
      this.setState(() => ({total}))
    })
    .catch(err => {
      this.setState(() => ({err: true}))
    })
  }

  getPercentaje = () => {
    return ((this.state.total * 100) / this.state.techo)
  }

  render () {
    return (
      <Box align='center'>
        <h1 style={{marginTop:'40px'}}>Techo Presupuestal</h1>
        {/*<Meter></Meter>*/}
        <Box>
          <Value value={this.getPercentaje()}
            units='%'
            align='start'
            size='large'/>
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
      </Box>
    )
  }
}

export default Main