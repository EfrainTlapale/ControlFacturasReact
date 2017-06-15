import React, {Component} from 'react'
import Box from 'grommet/components/Box'
import Table from 'grommet/components/Table'
import TableRow from 'grommet/components/TableRow'
import Heading from 'grommet/components/Heading'

const providers = [
  {id: 'nru3', nombre: 'Proveedor1', descripcion: 'Alguna descripcion'},
  {id: 'nru3', nombre: 'Proveedor1', descripcion: 'Alguna descripcion'},
  {id: 'nru3', nombre: 'Proveedor1', descripcion: 'Alguna descripcion'},
  {id: 'nru3', nombre: 'Proveedor1', descripcion: 'Alguna descripcion'}
]

class Providers extends Component {
  render(){
    return(
      <Box align='center'>
        <Heading>Proveedores</Heading>
        <Table>
          <thead>
            <tr>
              <th>
                Id
              </th>
              <th>
                Nombre
              </th>
              <th>
                Descripcion
              </th>
            </tr>
          </thead>
          <tbody>
            {providers.map((bill) => {
              return(
                <TableRow>
                  <td>{bill.id}</td>
                  <td>{bill.nombre}</td>
                  <td>{bill.descripcion}</td>
                </TableRow>
              )
            })}
          </tbody>
        </Table>
      </Box>
    )
  }
}

export default Providers