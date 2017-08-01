import React, {Component} from 'react'

import BillForm from './billForm'

class NewBill extends Component {
  componentWillMount() {
    window.scrollTo(0,0)
  }

  render(){
    return (
      <div>
        <BillForm method='post' url='/api/factura' title='Alta Factura' />
      </div>
    )
  }
}

export default NewBill
