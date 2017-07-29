import React from 'react'

import Crud from './crud'

const Providers = () => (
  <Crud resource='provider' resourceAlias='Proveedor' resourcePlural='Proveedores' fields={['rfc', 'nombre', 'domicilioFiscal']}/>
)

export default Providers