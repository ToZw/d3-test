export const treeData: any = {
  "sources": [
    { "dndType": "DnDSource", "id": 'source_1', "x": 50, "y": 100, "width": 50, "height": 50, "value": 'Source 1' },
    { "dndType": "DnDSource", "id": 'source_2', "x": 50, "y": 300, "width": 50, "height": 50, "value": 'Source 2' }
  ],
  "tree": {
    "id": "root",
    "name": "root",
    "type": "target",
    "dndType": "DnDTarget",
    "children": [
      {
        "id": "Child_0",
        "name": "Child_0",
        "type": "target",
        "dndType": "DnDTarget",
        "children": [
          {
            "id": "Child_0_0",
            "name": "Child_0_0",
            "type": "target",
            "dndType": "DnDTarget",
            "children": [
              { "id": "Child_0_0_0", "name": "Child_0_0_0", "type": "testo", "dndType": "DnDTarget", "value": 2928 },
              { "id": "Child_0_0_1", "name": "Child_0_0_1", "type": "source", "dndType": "DnDTarget", "value": 2801 },
              { "id": "Child_0_0_2", "name": "Child_0_0_2", "type": "target", "dndType": "DnDTarget", "value": 6703 },
              { "id": "Child_0_0_3", "name": "Child_0_0_3", "type": "target", "dndType": "DnDTarget", "value": 732 }
            ]
          },
          {
            "id": "Child_0_1",
            "name": "Child_0_1",
            "type": "target",
            "dndType": "DnDTarget",
            "children": [
              { "id": "Child_0_1_0", "name": "Child_0_1_0", "type": "target", "dndType": "DnDTarget", "value": 2523 },
              { "id": "Child_0_1_1", "name": "Child_0_1_1", "type": "target", "dndType": "DnDTarget", "value": 5720 },
              { "id": "Child_0_1_2", "name": "Child_0_1_2", "type": "target", "dndType": "DnDTarget", "value": 7830 },
              { "id": "Child_0_1_3", "name": "Child_0_1_3", "type": "target", "dndType": "DnDTarget", "value": 5903 },
              { "id": "Child_0_1_4", "name": "Child_0_1_4", "type": "target", "dndType": "DnDTarget", "value": 2306 }
            ]
          },
          {
            "id": "Child_0_2",
            "name": "Child_0_2",
            "type": "target",
            "dndType": "DnDTarget",
            "children": [
              { "id": "Child_0_2_0", "name": "Child_0_2_0", "type": "target", "dndType": "DnDTarget", "value": 7073 }
            ]
          }
        ]
      }
    ]
  }
}
