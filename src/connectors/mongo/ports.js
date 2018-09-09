import { PortModel } from './models';

const Ports = {};

Ports.ports = () => PortModel.find();

Ports.port = id => PortModel.findOne({ id });

export default Ports;
