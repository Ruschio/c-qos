import { html } from 'htm/preact';
import { SelectEntry, NumberFieldEntry } from '@bpmn-io/properties-panel';
import { isSelectEntryEdited, isNumberFieldEntryEdited } from '@bpmn-io/properties-panel';

import { useService } from 'bpmn-js-properties-panel';


export default function QoSProps(element) {

  const entries = [ 
    {
        id: 'history',
        element,
        component: History,
        isEdited: isSelectEntryEdited
    },
    {
        id: 'depth',
        element,
        component: Depth,
        isEdited: isNumberFieldEntryEdited
    },
    {
        id: 'reliability',
        element,
        component: Reliability,
        isEdited: isSelectEntryEdited
    },
    {
        id: 'durability',
        element,
        component: Durability,
        isEdited: isSelectEntryEdited
    },
    {
        id: 'deadline',
        element,
        component: Deadline,
        isEdited: isNumberFieldEntryEdited
    },
    {
        id: 'lifespan',
        element,
        component: Lifespan,
        isEdited: isNumberFieldEntryEdited
    },
    {
        id: 'liveliness',
        element,
        component: Liveliness,
        isEdited: isSelectEntryEdited
    },
    {
        id: 'lease_duration',
        element,
        component: LeaseDuration,
        isEdited: isNumberFieldEntryEdited
    }
  ];

  return entries;
}

function History(props) {
    const { element, id } = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        if (!element.businessObject.history) element.businessObject.history = 0;
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
        label=${ translate('History') }
        getValue=${ getValue }
        setValue=${ setValue }
        getOptions=${ getOptions }
        debounce=${ debounce }
    />`
}

function Depth(props) {
    const { element, id } = props;
  
    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');
  
    const getValue = () => {
      if (!element.businessObject.depth) element.businessObject.depth = 0;
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
      label=${ translate('Depth') }
      getValue=${ getValue }
      setValue=${ setValue }
      debounce=${ debounce }
    />`
}

function Reliability(props) {
    const { element, id } = props;
  
    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');
  
    const getValue = () => {
      if (!element.businessObject.reliability) element.businessObject.reliability = 0;
      return element.businessObject.reliability || 0;
    }
  
    const setValue = value => {
      return modeling.updateProperties(element, {
        reliability: value
      });
    }

    const getOptions = () => {
        return [
        { label: "Best Effort", value: 0 },
        { label: "Reliable", value: 1 }
        ];
    }
  
    return html`<${SelectEntry}
      id=${ id }
      element=${ element }
      label=${ translate('Reliability') }
      getValue=${ getValue }
      setValue=${ setValue }
      getOptions=${ getOptions }
      debounce=${ debounce }
    />`
}

function Durability(props) {
    const { element, id } = props;
  
    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');
  
    const getValue = () => {
      if (!element.businessObject.durability) element.businessObject.durability = 0;
      return element.businessObject.durability || 0;
    }
  
    const setValue = value => {
      return modeling.updateProperties(element, {
        durability: value
      });
    }

    const getOptions = () => {
        return [
        { label: "Transient Local", value: 0 },
        { label: "Volatile", value: 1 }
        ];
    }
  
    return html`<${SelectEntry}
      id=${ id }
      element=${ element }
      label=${ translate('Durability') }
      getValue=${ getValue }
      setValue=${ setValue }
      getOptions=${ getOptions }
      debounce=${ debounce }
    />`
}

function Deadline(props) {
    const { element, id } = props;
  
    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');
  
    const getValue = () => {
      if (!element.businessObject.deadline) element.businessObject.deadline = 0;
      return element.businessObject.deadline || 0;
    }
  
    const setValue = value => {
      return modeling.updateProperties(element, {
        deadline: value
      });
    }
  
    return html`<${NumberFieldEntry}
      id=${ id }
      element=${ element }
      label=${ translate('Deadline') }
      getValue=${ getValue }
      setValue=${ setValue }
      debounce=${ debounce }
    />`
}

function Lifespan(props) {
    const { element, id } = props;
  
    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');
  
    const getValue = () => {
      if (!element.businessObject.lifespan) element.businessObject.lifespan = 0;
      return element.businessObject.lifespan || 0;
    }
  
    const setValue = value => {
      return modeling.updateProperties(element, {
        lifespan: value
      });
    }
  
    return html`<${NumberFieldEntry}
      id=${ id }
      element=${ element }
      label=${ translate('Lifespan') }
      getValue=${ getValue }
      setValue=${ setValue }
      debounce=${ debounce }
    />`
}

function Liveliness(props) {
    const { element, id } = props;
  
    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');
  
    const getValue = () => {
      if (!element.businessObject.liveliness) element.businessObject.liveliness = 0;
      return element.businessObject.liveliness || 0;
    }
  
    const setValue = value => {
      return modeling.updateProperties(element, {
        liveliness: value
      });
    }

    const getOptions = () => {
        return [
        { label: "Automatic", value: 0 },
        { label: "Manual by Topic", value: 1 }
        ];
    }
  
    return html`<${SelectEntry}
      id=${ id }
      element=${ element }
      label=${ translate('Liveliness') }
      getValue=${ getValue }
      setValue=${ setValue }
      getOptions=${ getOptions }
      debounce=${ debounce }
    />`
}


function LeaseDuration(props) {
  const { element, id } = props;

  const modeling = useService('modeling');
  const translate = useService('translate');
  const debounce = useService('debounceInput');

  const getValue = () => {
    if (!element.businessObject.leaseDuration) element.businessObject.leaseDuration = 0;
    return element.businessObject.leaseDuration || 0;
  }

  const setValue = value => {
    return modeling.updateProperties(element, {
      leaseDuration: value
    });
  }

  return html`<${NumberFieldEntry}
    id=${ id }
    element=${ element }
    label=${ translate('Lease Duration') }
    getValue=${ getValue }
    setValue=${ setValue }
    debounce=${ debounce }
  />`
}