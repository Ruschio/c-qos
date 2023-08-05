import { html } from 'htm/preact';

import { NumberFieldEntry, isNumberFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function(element) {

  return [
    {
      id: 'depth',
      element,
      component: Depth,
      isEdited: isNumberFieldEntryEdited
    }
  ];
}

function Depth(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    return element.businessObject.depth || 0;
  }

  const setValue = value => {
    return modeling.updateProperties(element, {
      depth: value
    });
  }

  return html`<${NumberFieldEntry}
    id=${ id }
    element=${ element }
    description=${ translate('Apply a black qos spell') }
    label=${ translate('Depth') }
    getValue=${ getValue }
    setValue=${ setValue }
    debounce=${ debounce }
  />`
}
