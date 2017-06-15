import React, {Component} from 'react'
import Meter from 'grommet/components/Meter'
import Box from 'grommet/components/Box'
import Value from 'grommet/components/Value'
import Label from 'grommet/components/Label'

class Main extends Component {
  render () {
    return (
      <Box align='center'>
        <h1 style={{marginTop:'40px'}}>Techo Presupuestal</h1>
        {/*<Meter></Meter>*/}
        <Box>
          <Value value={60}
            units='%'
            align='start'
            size='large'/>
          <Meter vertical={false}
            size='large'
            value={60}
            colorIndex='neutral-1' />
          <Box direction='row'
            justify='between'
            pad={{"between": "small"}}
            responsive={false}>
            <Label size='small'>
              $0
            </Label>
            <Label size='small'>
              $100,000
            </Label>
          </Box>
        </Box>
      </Box>
    )
  }
}

export default Main