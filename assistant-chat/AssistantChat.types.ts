import { IActionBlockProps, IHashtag } from '../action-block/ActionBlock';
import { IAction } from '../action-row/ActionRow';
import { IGeneralFlowCardProps } from '../general-flow-card/GeneralFlowCard';
import { IOutlinedDropdownProps } from '../outlined-dropdown/OutlinedDropdown';
import { IApproveBlockProps } from '../approve-block/ApproveBlock';
import { ICheckGroupOption } from '../check-group/CheckGroup';
import { TOption } from '../search-select';
import { IOption as IResponseOption } from '../responses-dropdown/ResponsesDropdown';

export type TComponent =
  | {
      componentType: 'action_block';
      app: 'drive' | 'gmail';
      title: string;
      description: string;
      hashtags: IHashtag[];
    }
  | {
      componentType: 'action_buttons';
      okLabel: string;
      cancelLabel: string;
    }
  | {
      componentType: 'approve_block_light';
      title: string;
      description: string;
      code: string;
    }
  | {
      componentType: 'action_row';
      action: IAction;
      index: number;
      expanded?: boolean;
    }
  | {
      componentType: 'approve_block_header';
      title: string;
      code: string;
      expanded?: boolean;
    }
  | {
      componentType: 'approve_block';
      title: string;
      description: string;
      code: string;
      expanded?: boolean;
      trigger: IActionBlockProps;
      actions: IActionBlockProps[];
      minified?: boolean;
    }
  | {
      componentType: 'assistant_question';
      question: string;
    }
  | {
      componentType: 'button';
      label: string;
    }
  | {
      componentType: 'answer_group';
      options: string[];
    }
  | {
      componentType: 'file_dropzone';
    }
  | {
      componentType: 'json_response';
      for: string;
      json: string;
    }
  | {
      componentType: 'search_select';
      options: TOption[];
      isOpen?: boolean;
    }
  | {
      componentType: 'textarea';
      text: string;
      files: string[];
    }
  | {
      componentType: 'general_flow_block_light';
      rpas: string[];
      code: string;
    }
  | {
      componentType: 'general_flow_block';
      items: IGeneralFlowCardProps[];
      code: string;
    }
  | {
      componentType: 'input';
      type: string;
      placeholder: string;
      id: string;
      inputType?: string;
    }
  | {
      componentType: 'logic_row';
      logicDropdown: IOutlinedDropdownProps;
      actionDropdowns: IOutlinedDropdownProps[];
    }
  | {
      componentType: 'node_message';
      message: string;
    }
  | {
      componentType: 'pdf_preview';
      file: string;
      fileName: string;
      okLabel?: string;
      cancelLabel?: string;
    }
  | {
      componentType: 'rpa_suggestion_block';
      app: 'drive' | 'gmail';
      rpas: IApproveBlockProps[];
    }
  | {
      componentType: 'rpa_suggestions_block_light';
      app: 'drive' | 'gmail';
      rpas: IApproveBlockProps[];
    }
  | {
      componentType: 'rpa_multiselect';
      rpas: ICheckGroupOption[];
    }
  | {
      componentType: 'screen_recorder';
      active?: boolean;
    }
  | {
      componentType: 'sign_box';
    }
  | {
      componentType: 'suggestions_row';
      options: IResponseOption[];
      suggestion?: string;
    }
  | {
      componentType: 'voice_recorder';
      label: string;
      active?: boolean;
    };

export type TTask = {
  content: string;
  description: string;
  id: string;
  canComplete: boolean;
  projectUrl: string;
  projectName: string;
  projectId: string;
  responsiblePartyIds: string;
  creatorFirstname: string;
  creatorLastname: string;
};

export type TPerson = {
  firstName: string;
  lastName: string;
  id: string;
  avatarUrl: string;
};

export type TTimer = {
  lastStartedAt: string;
  running: boolean;
  duration: number;
  createdAt: string;
};

export type TFullTimer = {
  timer: TTimer;
  task: TTask;
};
