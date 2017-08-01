import React, { Component } from 'react'

import axios from 'axios'

import BillForm from './billForm'

class EditBill extends Component {
  state = {
    billData: {},
    loading: true
  }

  componentDidMount() {
    const url = '/api/factura/' + this.props.match.params.id
     axios.get(url)
     .then(({data}) => {
       this.setState(() => ({loading: false}))
       this.setState(() => ({billData: data}))
     })
     .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        {this.state.loading ? <h1>Cargando...</h1>:
          <BillForm billData={this.state.billData} method='put' url='/api/factura' title='Editar Factura'/>
        }
      </div>
    )
  }
}

export default EditBill