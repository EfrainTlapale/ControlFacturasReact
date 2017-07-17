import React, { Component } from 'react'

import Heading from 'grommet/components/Heading' 

import axios from 'axios'

import BillForm from './billForm'

class EditBill extends Component {
  state = {
    billData: {}
  }

  componentDidMount() {
    const url = '/api/bill/' + this.props.match.params.id
     axios.get(url)
     .then(({data}) => {
       this.setState(() => ({billData: data}))
     })
     .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        <Heading align='center'>Editar Factura</Heading>
        <BillForm billData={this.state.billData} onSubmit={function(){console.log(this.state)}}/>
      </div>
    )
  }
}

export default EditBill