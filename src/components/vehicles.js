import React from 'react'

import Crud from './crud'

const Vehicles = () => (
  <Crud resource='vehiculo' resourceAlias='Vehículo' resourcePlural='Vehículos' fields={['placas', 'modelo', 'color']}/>
)

export default Vehicles
