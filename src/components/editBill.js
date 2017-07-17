import React, { Component } from 'react'

import Heading from 'grommet/components/Heading' 

import axios from 'axios'

import BillForm from './billForm'

class EditBill extends Component {
  state = {
    billData: {},
    loading: true
  }

  componentDidMount() {
    const url = '/api/bill/' + this.props.match.params.id
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
        <Heading align='center'>Editar Factura</Heading>
        {this.state.loading ? <h1>Cargando...</h1>:
          <BillForm billData={this.state.billData} onSubmit={function(){console.log(this.state)}}/>
        }
      </div>
    )
  }
}

export default EditBill