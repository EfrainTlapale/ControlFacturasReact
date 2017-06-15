import React, {Component} from 'react'
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Heading from 'grommet/components/Heading'
import Box from 'grommet/components/Box'


const allBills = [
  {id: 192192, proveedor: 'Empresa1', importe: 9243943},
  {id: 192192, proveedor: 'Empresa2', importe: 9243943},
  {id: 192192, proveedor: 'Empresa3', importe: 9243943},
  {id: 192192, proveedor: 'Empresa4', importe: 9243943},
  {id: 192192, proveedor: 'Empresa5', importe: 9243943}
]

class Bills extends Component {
  render(){
    return( 
      <Box align='center'>
        <Heading>Facturas</Heading>
        <Table>
          <thead>
            <tr>
              <th>
                Folio
              </th>
              <th>
                Proveedor
              </th>
              <th>
                Importe
              </th>
            </tr>
          </thead>
          <tbody>
            {allBills.map((bill) => {
              return(
                <TableRow>
                  <td>{bill.id}</td>
                  <td>{bill.proveedor}</td>
                  <td>{bill.importe}</td>
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
