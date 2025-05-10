import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSlash } from '@fortawesome/free-solid-svg-icons';

export default function IconStack() {
  return (
    <span className="fa-stack fa-1x">
      <FontAwesomeIcon icon={faEye} className="fa-stack-1x text-stone-600" />
      <FontAwesomeIcon icon={faSlash} className="fa-stack-1x text-red-500" />
    </span>
  );
}