import $ from 'jquery';
import BpmnModeler from 'bpmn-js/lib/Modeler';

import { isSignalSupported } from '../utils/EventDefinitionUtil';

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import qosPropertiesProviderModule from './provider/qos';
import qosModdleDescriptor from './descriptors/qos';

import {
  debounce, forEach
} from 'min-dash';

import diagramXML from '../resources/newDiagram.bpmn';
import '../styles/app.less';


var container = $('#js-drop-zone');

var bpmnModeler = new BpmnModeler({
  container: '#js-canvas',
  propertiesPanel: {
    parent: '#js-properties-panel'
  },
  additionalModules: [
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    qosPropertiesProviderModule
  ],
  moddleExtensions: {
    qos: qosModdleDescriptor
  }
});

const modeling = bpmnModeler.get('modeling');
const registry = bpmnModeler.get('elementRegistry');


// --- QoS compatibility check --- //

/* Creating Rule Engine instance */
const R = new NodeRules();

/* Add QoS compatibility rule */
const rule = {
  condition: (R, qos) => {
    R.when(
      qos.pub.reliability < qos.sub.reliability ||
      qos.pub.durability > qos.sub.durability ||
      qos.pub.deadline > qos.sub.deadline ||
      qos.pub.liveliness < qos.sub.liveliness ||
      qos.pub.leaseDuration > qos.sub.leaseDuration
    );
  },
  consequence: (R, qos) => {
    qos.result = false;
    qos.reason = "The QoS policies are not compatible";
    R.stop();
  },
};

/* Register QoS rule */
R.register(rule);

bpmnModeler.on(['shape.removed'], (e) => {
  e.stopPropagation();
  e.preventDefault();
  const element = e.element;
});

/* Init QoS parameters when element is added */
bpmnModeler.on(['bpmnElement.added'], (e) => {
  e.stopPropagation();
  e.preventDefault();
  const element = e.element;
  
  if(isSignalSupported(element) && element.type != "label") {
    let qos = {
      history: element.businessObject.history || 0,
      depth: element.businessObject.depth || 0,
      reliability: element.businessObject.reliability || 0,
      durability: element.businessObject.durability || 0,
      deadline: element.businessObject.deadline || 0,
      lifespan: element.businessObject.lifespan || 0,
      liveliness: element.businessObject.liveliness || 0,
      leaseDuration: element.businessObject.leaseDuration || 0
    };
    modeling.updateProperties(element, qos);
  }
});

/* Trigger QoS check every time a change occurs */
bpmnModeler.on(['commandStack.element.updateProperties.postExecuted','commandStack.element.updateModdleProperties.postExecuted'], (e) => {
  e.stopPropagation();
  e.preventDefault();
  if(e.context.properties.di) return; // if background changes exit

  const element = e.context.element;
  if(!pubOrSub(element)) return; // if not signal node exit
  element.businessObject.incompatibilities = []; // reset incompatibilities
  if(!element.businessObject.eventDefinitions[0].signalRef) {
    modeling.setColor(registry.get(element.id), {
      fill: "#fff"
    }); // reset node color
    return;
  }
  const signalName = element.businessObject.eventDefinitions[0].signalRef.name; // get signal topic name

  var elements = registry.filter(function(element) {
    return (
      pubOrSub(element) &&
      element.businessObject.eventDefinitions[0].signalRef &&
      element.businessObject.eventDefinitions[0].signalRef.name == signalName
    );
  });

  for (const i in elements) {
    const source = elements[i];
    const type = pubOrSub(source);
    modeling.setColor(source, {
      fill: "#33bb77"
    }); // reset node color

    elements.forEach(target => {
      if (type == pubOrSub(target) || source.id == target.id) return;
      source.businessObject.incompatibilities = [];
      var communication = {
        pub: type == "pub" ? source.businessObject : target.businessObject, 
        sub: type == "sub" ? source.businessObject : target.businessObject
      };
      R.execute(communication, (data) => {
        if (data.result !== true) {
          source.businessObject.incompatibilities.push(target.businessObject.name);
          modeling.setColor(source, {
            fill: "ff0000"
          });
          modeling.setColor(target, {
            fill: "ff0000"
          });
        }
      });
    });
  }
});

/* Evaluate if signal is publisher or subscriber */
function pubOrSub(el) {
  if(!isSignalSupported(el)) return null;
  else if(el.type == "bpmn:StartEvent" || el.type == "bpmn:IntermediateCatchEvent") return "sub";
  else if(el.type == "bpmn:EndEvent" || el.type == "bpmn:IntermediateThrowEvent") return "pub";
  return null;
}

bpmnModeler.on(['element.click'], (e) => {
  let incompatibilities = e.element.businessObject.incompatibilities;
  if(!incompatibilities || incompatibilities.length == 0)
    document.getElementById("incompatibilities").innerHTML = null;
  else
    document.getElementById("incompatibilities").innerHTML = "<div><b>INCOMPATIBILITIES WITH:</b> " + incompatibilities + "</div>";
});

// ---------------- //


function createNewDiagram() {
  openDiagram(diagramXML);
}

async function openDiagram(xml) {
  try {
    await bpmnModeler.importXML(xml);

    container
      .removeClass('with-error')
      .addClass('with-diagram');
  } catch (err) {

    container
      .removeClass('with-diagram')
      .addClass('with-error');

    container.find('.error pre').text(err.message);

    console.error(err);
  }
}

function registerFileDrop(container, callback) {

  function handleFileSelect(e) {
    e.stopPropagation();
    e.preventDefault();

    var files = e.dataTransfer.files;
    var file = files[0];
    var reader = new FileReader();

    reader.onload = function(e) {
      var xml = e.target.result;
      callback(xml);
    };

    reader.readAsText(file);
  }

  function handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();

    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  container.get(0).addEventListener('dragover', handleDragOver, false);
  container.get(0).addEventListener('drop', handleFileSelect, false);
}


////// file drag / drop ///////////////////////

// check file api availability
if (!window.FileList || !window.FileReader) {
  window.alert(
    'Looks like you use an older browser that does not support drag and drop. ' +
    'Try using Chrome, Firefox or the Internet Explorer > 10.');
} else {
  registerFileDrop(container, openDiagram);
}

// bootstrap diagram functions
$(function() {

  $('#js-create-diagram').click(function(e) {
    e.stopPropagation();
    e.preventDefault();

    createNewDiagram();
  });

  var downloadLink = $('#js-download-diagram');
  var downloadSvgLink = $('#js-download-svg');

  $('.buttons a').click(function(e) {
    if (!$(this).is('.active')) {
      e.preventDefault();
      e.stopPropagation();
    }
  });

  function setEncoded(link, name, data) {
    var encodedData = encodeURIComponent(data);

    if (data) {
      link.addClass('active').attr({
        'href': 'data:application/bpmn20-xml;charset=UTF-8,' + encodedData,
        'download': name
      });
    } else {
      link.removeClass('active');
    }
  }

  var exportArtifacts = debounce(async function() {

    try {

      const { svg } = await bpmnModeler.saveSVG();

      setEncoded(downloadSvgLink, 'diagram.svg', svg);
    } catch (err) {

      console.error('Error happened saving SVG: ', err);

      setEncoded(downloadSvgLink, 'diagram.svg', null);
    }

    try {

      const { xml } = await bpmnModeler.saveXML({ format: true });

      setEncoded(downloadLink, 'diagram.bpmn', xml);
    } catch (err) {

      console.error('Error happened saving diagram: ', err);

      setEncoded(downloadLink, 'diagram.bpmn', null);
    }
  }, 500);

  bpmnModeler.on('commandStack.changed', exportArtifacts);
});
