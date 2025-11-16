
import { Helmet } from 'react-helmet'

export default function CustomTitle({title}) {
   return (
      <Helmet>
         <title> Store App   |   {title}</title>
      </Helmet>
   )
}
