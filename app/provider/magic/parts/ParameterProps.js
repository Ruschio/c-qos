import { TextFieldEntry } from '@bpmn-io/properties-panel';

import { useService } from 'bpmn-js-properties-panel';


export default function ParameterProps(props) {

  const {
    idPrefix,
    parameter
  } = props;

  const entries = [ 
    {
      id: idPrefix + '-namee',
      component: Name,
      idPrefix,
      parameter
    },
    {
      id: idPrefix + '-valuee',
      component: Value,
      idPrefix,
      parameter
    }
  ];

  return entries;
}

function Name(props) {
  const {
    idPrefix,
    element,
    parameter
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.namee || '';
  }

  const setValue = value => {
    return modeling.updateProperties(element, {
      namee: value
    });
  }

  return TextFieldEntry({
    element: parameter,
    id: idPrefix + '-namee',
    label: translate('Name'),
    getValue,
    setValue,
    debounce
  });
}

function Value(props) {
  const {
    idPrefix,
    element,
    parameter
  } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.valuee || '';
  }

  const setValue = value => {
    return modeling.updateProperties(element, {
      valuee: value
    });
  }

  return TextFieldEntry({
    element: parameter,
    id: idPrefix + '-valuee',
    label: translate('Value'),
    getValue,
    setValue,
    debounce
  });
}