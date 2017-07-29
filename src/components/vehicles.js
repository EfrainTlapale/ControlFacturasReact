import React from 'react'

import Crud from './crud'

const Vehicles = () => (
  <Crud resource='vehicle' resourceAlias='Vehículo' resourcePlural='Vehículos' fields={['Placas', 'Modelo', 'Color']}/>
)

export default Vehicles
