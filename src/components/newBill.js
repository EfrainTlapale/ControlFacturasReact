import React, {Component} from 'react'

import Heading from 'grommet/components/Heading' 

import axios from 'axios'

import BillForm from './billForm'

class NewBill extends Component {
  saveBill = function(newData){
    axios.post( '/api/bill',newData)
    .then(res => {
      if(res.data.errors) {
        this.setState({
          toastStatus: 'critical',
          toastMessage: 'Error al guardar factura, por favor verifique los datos',
          showToast: true
        })
      } else {
        this.setState({
          modified: false,
          date: '',
          selectedProvider: '',
          providerID: '',
          selectedVehicle: '',
          vehicleID: '',
          concepts: [
            {id: 1, units: 0, unitType: '', description: '', unitPrice: 0, total: 0}
          ],
          showToast: true,
          toastStatus: 'ok',
          toastMessage: 'Guardado con éxito',
          isForVehicle: false
        })
      }
    })
    .catch(err => {
      this.setState({
        toastStatus: 'critical',
        toastMessage: 'Error en la aplicación',
        showToast: true
      })
    })
  }
  render(){
    return (
      <div>
        <Heading align='center'>
          Alta Factura
        </Heading>
        <BillForm onSubmit={this.saveBill} />
      </div>
    )
  }
}

export default NewBill
