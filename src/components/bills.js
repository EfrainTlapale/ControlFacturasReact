import React, {Component} from 'react'
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'

import {Link} from 'react-router-dom'

import axios from 'axios'
import numeral from 'numeral'
import moment from 'moment'
moment.locale('es')

class Bills extends Component {
  state = {
    bills: [],
    error: false
  }
  componentDidMount() {
    axios.get('/api/bill')
    .then(({data}) => {
      this.setState(() => ({bills: data}))
    })
    .catch(err => {
      this.setState({
        error: true
      })
    })
  }
  render(){
    return( 
      <Box align='center'>
        <Heading>Facturas</Heading>
        <Table>
          <thead>
            <tr>
              <th>
                Proveedor
              </th>
              <th>
                Total
              </th>
              <th>
                Fecha
              </th>
              <th>
                Vehículo
              </th>
              <th>
                Detalles
              </th>
            </tr>
          </thead>
          <tbody>
            {this.state.bills.map((bill) => {
              return(
                <TableRow key={bill._id}>
                  {bill.provider ? <td>{bill.provider.nombre}</td>: <td>Ninguno</td>}
                  <td>${numeral(bill.total).format('0,0')}</td>
                  <td>{moment(bill.date).format('LL')}</td>
                  <td>{bill.vehicle ? `${bill.vehicle.modelo} ${bill.vehicle.color} ${bill.vehicle.placas}` : 'No aplica'}</td>
                  <td><Link to={'/factura/' + bill._id} style={{textDecoration: 'none', color: 'white'}}><Box colorIndex='brand' align='center' style={{borderRadius: '10px'}}>Ver Detalles</Box></Link></td>
                </TableRow>
              )
            })}
          </tbody>
        </Table>
      </Box> 
    )
  }
}

export default Bills
