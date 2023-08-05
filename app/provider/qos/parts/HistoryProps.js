import { html } from 'htm/preact';

import { SelectEntry, isSelectEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function(element) {

  return [
    {
      id: 'history',
      element,
      component: History,
      isEdited: isSelectEntryEdited
    }
  ];
}

function History(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');


  const getValue = () => {
    return element.businessObject.history || 0;
  }

  const setValue = value => {
    return modeling.updateProperties(element, {
      history: value
    });
  }

  const getOptions = () => {
    return [
      { label: "Keep Last", value: 0 },
      { label: "Keep All", value: 1 }
    ];
  }

  return html`<${SelectEntry}
    id=${ id }
    element=${ element }
    description=${ translate('Select a value for history policy') }
    label=${ translate('History') }
    getValue=${ getValue }
    setValue=${ setValue }
    getOptions=${ getOptions }
    debounce=${ debounce }
  />`
}
