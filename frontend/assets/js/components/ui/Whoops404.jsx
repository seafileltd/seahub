// import { withRouter } from 'react-router-dom'
import PageTemplate from './PageTemplate'

const Whoops404 = ({ location }) => (
    <PageTemplate>
      <div className="whoops-404">
        <h1>Resource not found at '{location.pathname}'</h1>
      </div>
    </PageTemplate>
)

export default Whoops404;
