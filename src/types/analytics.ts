export interface ToolActionEvent {
  tool_name: string
  action_name: string
}

export interface ToolCompletedEvent {
  tool_name: string
  processing_time_ms: number
  success: boolean
}

export interface ToolErrorEvent {
  tool_name: string
  error_type: string
  error_message: string
}

export interface ToolDownloadEvent {
  tool_name: string
  file_type: string
  file_size_kb: number
}

export interface SearchEvent {
  search_term: string
  results_count: number
}

export interface CategoryClickedEvent {
  category_name: string
  from_page: string
}

export interface RelatedToolClickedEvent {
  from_tool: string
  to_tool: string
}

export type AnalyticsEvent =
  | { event: 'tool_action_clicked'; data: ToolActionEvent }
  | { event: 'tool_completed'; data: ToolCompletedEvent }
  | { event: 'tool_error'; data: ToolErrorEvent }
  | { event: 'tool_download'; data: ToolDownloadEvent }
  | { event: 'search'; data: SearchEvent }
  | { event: 'category_clicked'; data: CategoryClickedEvent }
  | { event: 'related_tool_clicked'; data: RelatedToolClickedEvent }
