import * as d3 from "d3";
import { DnDSourceModule, DnDTargetModule, DnDModuleType } from '../d3-chart/d3-chart.component';
import { DragBehavior } from 'd3';


export function addDnDDragging<SOURCE extends DnDSourceModule, TARGET extends DnDTargetModule>(sourceType: DnDModuleType, targetType: DnDModuleType): DragBehavior<any, any, any | any> {

  let currentDragSelection = null;

  let hoveredTargetSelection = null;

  function createDraggingSource (data: SOURCE, index: number, elementGroup: any) {
    currentDragSelection = this.svgContainer
      .append('g')
      .datum(data)
      .attr('transform', (data) => `translate(${data.x}, ${data.y})`);

    currentDragSelection
      .datum(data)
      .append('rect')
      .attr('width', data => data.width)
      .attr('height', data => data.height)
      .attr('fill', 'white')
      .attr('text', 'Drag here')
      .attr('stroke', '#2378ae')
      .attr('stroke-linecap', 'butt')
      .attr('stroke-width', '3');

    currentDragSelection
      .datum(data)
      .append("text")
      .attr("x", (data) => data.width / 4)
      .attr("y", (data) => data.height / 2)
      .attr("dy", ".35em")
      .text((data) => data.value);
  }

  function findHoveredTargetModule (data: SOURCE): d3.Selection<d3.BaseType, TARGET, HTMLElement, any> | null  {
    const targetModules: TARGET[] = this.modules
      .filter(module => module.type === targetType)
      .filter(module => isIntersection(
        { top: module.y, right: module.x + module.width, bottom: module.y + module.height, left: module.x },
        { top: d3.event.y, right: d3.event.x + data.width, bottom: d3.event.y + data.height, left: d3.event.x })) as TARGET[];

    if (targetModules.length === 0) {
      return;
    }

    return this.svgContainer.select(`#${targetModules[0].id}`) as d3.Selection<d3.BaseType, TARGET, HTMLElement, any>;
  }

  function isIntersection (first: { top: number, right: number, bottom: number, left: number }, second: { top: number, right: number, bottom: number, left: number }) {
    return !(second.left > first.right ||
      second.right < first.left ||
      second.top > first.bottom ||
      second.bottom < first.top);
  }

  return d3.drag()
    .on('start', (data: SOURCE, index: number, elementGroup: any) => {
      createDraggingSource(data, index, elementGroup);
    })
    .on('drag', (data: SOURCE) => {
      currentDragSelection
        .attr('transform', (data) => `translate(${d3.event.x}, ${d3.event.y})`);

      // if (draggingTimeout) {
      //   return;
      // }

      // draggingTimeout = setTimeout(() => draggingTimeout = null, 100);

      const newHoveredTargetSelection = findHoveredTargetModule(data);

      if (!newHoveredTargetSelection
        || (hoveredTargetSelection && newHoveredTargetSelection.attr('id') !== hoveredTargetSelection.attr('id'))) {

        if (hoveredTargetSelection) {
          hoveredTargetSelection
            .select('rect')
            .attr('stroke', '#2378ae');
        }

        hoveredTargetSelection = newHoveredTargetSelection;
        return;
      }

      hoveredTargetSelection = newHoveredTargetSelection;
      hoveredTargetSelection
        .select('rect')
        .attr('stroke', 'red');
    })
    .on('end', (data: SOURCE) => {
      if (hoveredTargetSelection) {
        hoveredTargetSelection
          .select('rect')
          .attr('stroke', '#2378ae');
        hoveredTargetSelection = null;
      }

      const targetSelection = findHoveredTargetModule(data);

      if (!targetSelection) {
        currentDragSelection.remove();
        currentDragSelection = null;
        return;
      }

      targetSelection
        .select('rect')
        .attr('width', data.width)
        .attr('height', data.height)
        .attr('fill', 'white')
        .attr('text', 'Drag here')
        .attr('stroke', '#2378ae')
        .attr('stroke-dasharray', 'unset')
        .attr('stroke-linecap', 'butt')
        .attr('stroke-width', '3');

      targetSelection
        .select('text')
        .text(data.value);

      currentDragSelection.remove();
      currentDragSelection = null;
    });
}


