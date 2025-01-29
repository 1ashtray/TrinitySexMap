import React, { useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import { initialNodes, initialLinks } from '../data/initialData.js';
import '../styles/Graph.css';

function PeopleGraph() {
  // State for graph data
  const [nodes, setNodes] = useState(initialNodes);
  const [links, setLinks] = useState(initialLinks);

  // State for the form
  const [newPerson, setNewPerson] = useState('');
  const [connectTo, setConnectTo] = useState(''); // the existing person to connect

  // Handle form submit
  const handleAddPerson = (e) => {
    e.preventDefault();

    if (!newPerson.trim()) {
      alert('Please enter a name for the new person.');
      return;
    }

    // Create a new node with the ID as the person's name
    const personExists = nodes.some((n) => n.id === newPerson);
    if (personExists) {
      alert('This person already exists in the graph.');
      return;
    }

    // Add the node
    const updatedNodes = [...nodes, { id: newPerson }];

    // Add a link if user wants to connect it to an existing node
    let updatedLinks = [...links];
    if (connectTo) {
      updatedLinks.push({
        source: connectTo,
        target: newPerson
      });
    }

    setNodes(updatedNodes);
    setLinks(updatedLinks);

    // Reset form
    setNewPerson('');
    setConnectTo('');
  };

  return (
    <div className="graph-container">
      <div className="form-container">
        <h2>Add a New Person</h2>
        <form onSubmit={handleAddPerson}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={newPerson}
              onChange={(e) => setNewPerson(e.target.value)}
              placeholder="e.g., Emma"
            />
          </div>

          <div>
            <label htmlFor="connectTo">Connect to:</label>
            <select
              id="connectTo"
              value={connectTo}
              onChange={(e) => setConnectTo(e.target.value)}
            >
              <option value="">No one</option>
              {nodes.map((node) => (
                <option key={node.id} value={node.id}>
                  {node.id}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Add Person</button>
        </form>
      </div>

      <div className="force-graph">
        <ForceGraph2D
          width={800}
          height={600}
          graphData={{ nodes, links }}
          nodeLabel="id"
          nodeAutoColorBy="id"
        />
      </div>
    </div>
  );
}

export default PeopleGraph;
