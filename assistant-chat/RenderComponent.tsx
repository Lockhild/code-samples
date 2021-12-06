import React, { memo, RefObject, useCallback, useMemo, useState } from 'react';
import uniqueId from 'lodash.uniqueid';

import LogicRow from '../logic-row/LogicRow';
import ActionBlock from '../action-block/ActionBlock';
import ActionButtons from '../action-buttons/ActionButtons';
import ApproveBlockLight from '../approve-block-light/ApproveBlockLight';
import ActionRow from '../action-row/ActionRow';
import { notImplemented } from '../../helpers/utils';
import ApproveBlockHeader from '../../components/approve-block-header/ApproveBlockHeader';
import ApproveBlock from '../approve-block/ApproveBlock';
import AssistantQuestion from '../assistant-question/AssistantQuestion';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import FileDropzone from '../file-dropzone/FileDropzone';
import PdfSelect from '../pdf-select/PdfSelect';
import SearchSelect from '../search-select';
import GeneralFlowBlockLight from '../general-flow-block-light/GeneralFlowBlockLight';
import GeneralFlowBlock from '../general-flow-block/GeneralFlowBlock';
import Message from '../../components/message/Message';
import RpaSuggestionsBlock from '../rpa-suggestions-block/RpaSuggestionsBlock';
import RpaSuggestionsBlockLight from '../rpa-suggestions-block-light/RpaSuggestionsBlockLight';
import RPAMultiselect from '../rpa-multiselect/RPAMultiselect';
import ScreenRecorder from '../../components/screen-recorder/ScreenRecorder';
import SignBox from '../sign-box/SignBox';
import SuggestionsRow from '../suggestions-row/SuggestionsRow';
import VoiceRecorder from '../../components/voice-recorder/VoiceRecorder';
import Textarea from '../../components/textarea/Textarea';
import PdfPreview from '../pdf-preview/PdfPreview';
import { decodeText, isValidJson } from '../../helpers/utils';
import { Response } from '../../helpers/types';
import TaskSelect from '../task-select/TaskSelect';
import TeamworkTaskTimer from '../teamwork-task-timer/TeamworkTaskTimer';
import AnswerGroup from '../answer-group/AnswerGroup';
import { useSocket } from '../../helpers/socket';
import TeamworkTask from '../teamwork-task/TeamworkTask';
import { TComponent, TTask } from './';
import { TFullTimer } from './AssistantChat.types';

interface IRenderComponentProps {
  component: TComponent;
  containerRef: RefObject<HTMLDivElement> | null;
}

const RenderComponent: React.FC<IRenderComponentProps> = memo(({ component, containerRef }) => {
  const { sendMessage } = useSocket();
  const [userInput, setUserInput] = useState<string | undefined>();

  const onTextareaConfirm = useCallback(
    (text: string) => {
      sendMessage(text, 'object');
    },
    [sendMessage]
  );

  const inputId = useMemo(() => uniqueId(), [component]);

  const onTextareaDiscard = useCallback(() => {
    sendMessage(Response.NEGATIVE);
  }, [sendMessage]);

  const savePdfFile = useCallback(() => {
    sendMessage(Response.POSITIVE);
  }, [sendMessage]);

  const onCancelPdfPreview = useCallback(() => {
    sendMessage(Response.NEGATIVE);
  }, [sendMessage]);

  const onTaskSelect = useCallback(
    (task) => {
      sendMessage(
        JSON.stringify({
          taskId: task.id,
          projectId: task.projectId,
        }),
        'object'
      );
    },
    [sendMessage]
  );

  const onButtonClick = useCallback(() => {
    sendMessage(Response.POSITIVE);
  }, [sendMessage]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();

        if (!userInput) {
          return;
        }

        sendMessage(userInput);
        return;
      }
    },
    [userInput, sendMessage]
  );

  const handleChange = useCallback((e) => {
    setUserInput(e.target.value);
  }, []);

  if (!component || !component.componentType) {
    return null;
  }

  switch (component.componentType) {
    case 'action_block':
      return (
        <ActionBlock
          app={component.app}
          title={component.title}
          description={component.description}
          hashtags={component.hashtags}
        />
      );
    case 'action_buttons':
      return <ActionButtons okLabel={component.okLabel} cancelLabel={component.cancelLabel} />;
    case 'approve_block_light':
      return (
        <ApproveBlockLight
          title={component.title}
          description={component.description}
          code={component.code}
        />
      );
    case 'action_row':
      return (
        <ActionRow
          action={component.action}
          index={component.index}
          expanded={component.expanded}
          onDelete={notImplemented}
        />
      );
    case 'approve_block_header':
      return (
        <ApproveBlockHeader
          title={component.title}
          code={component.code}
          expanded={component.expanded}
          onToggleCollapsed={notImplemented}
        />
      );
    case 'approve_block':
      return (
        <ApproveBlock
          title={component.title}
          description={component.description}
          code={component.code}
          trigger={component.trigger}
          actions={component.actions}
          expanded={component.expanded}
          minified={component.minified}
          onApprove={notImplemented}
          onCancel={notImplemented}
        />
      );
    case 'assistant_question':
      return <AssistantQuestion className='mx-4'>{component.question}</AssistantQuestion>;
    case 'button':
      return <Button onClick={onButtonClick}>{component.label}</Button>;
    case 'answer_group':
      const cgOptions = component.options.map((label) => ({ label }));
      return <AnswerGroup options={cgOptions} name='answer_group' />;
    case 'file_dropzone':
      return <FileDropzone />;
    case 'json_response':
      if (component.for === 'teamwork_tasks') {
        return (
          <TaskSelect tasks={JSON.parse(decodeText(component.json))} onSelect={onTaskSelect} />
        );
      }

      if (component.for === 'pdf_select') {
        return <PdfSelect selectOptions={JSON.parse(decodeText(component.json))} />;
      }

      if (component.for === 'assign_task') {
        const allowedTasks = JSON.parse(decodeText(component.json)).filter(
          (task: TTask) => task.canComplete
        );

        return <TaskSelect tasks={allowedTasks} onSelect={onTaskSelect} />;
      }

      if (component.for === 'task_data') {
        const taskData = JSON.parse(decodeText(component.json));

        return (
          <TeamworkTask containerRef={containerRef} task={taskData.task} people={taskData.people} />
        );
      }

      if (component.for === 'teamwork_timer') {
        let secondsSinceLastStart = 0;
        let fullTimer: TFullTimer | undefined;

        if (component.json && isValidJson(decodeText(component.json))) {
          fullTimer = JSON.parse(decodeText(component.json));

          if (!fullTimer) {
            return <></>;
          }

          secondsSinceLastStart = Math.round(
            (new Date().getTime() - new Date(fullTimer.timer.lastStartedAt).getTime()) / 1000
          );
        }

        if (!fullTimer) {
          return <></>;
        }

        const duration = !fullTimer.timer.running
          ? fullTimer.timer.duration
          : fullTimer.timer.createdAt
          ? fullTimer.timer.duration + secondsSinceLastStart
          : 0;

        return (
          <TeamworkTaskTimer
            key={uniqueId()}
            task={fullTimer.task.content}
            description={fullTimer.task.description}
            url={`https://${fullTimer.task?.projectUrl}/#/tasks/${fullTimer.task?.id}`}
            duration={duration}
            isRunning={fullTimer.timer.running}
          />
        );
      }
      return <></>;

    case 'search_select':
      return <SearchSelect selectOptions={component.options} />;
    case 'textarea':
      return (
        <Textarea
          value={component.text}
          files={component.files}
          onConfirm={onTextareaConfirm}
          onDiscard={onTextareaDiscard}
        />
      );
    case 'general_flow_block_light':
      return <GeneralFlowBlockLight rpas={component.rpas} code={component.code} />;
    case 'general_flow_block':
      return (
        <GeneralFlowBlock
          items={component.items}
          code={component.code}
          onApprove={notImplemented}
          onCancel={notImplemented}
        />
      );
    case 'input':
      return (
        <Input
          key={inputId}
          className='w-full'
          type={component.type || 'text'}
          placeholder={component.placeholder}
          onKeyDown={handleKeyPress}
          onChange={handleChange}
          autoFocus
        />
      );
    case 'logic_row':
      return (
        <LogicRow
          logicDropdown={component.logicDropdown}
          actionDropdowns={component.actionDropdowns}
        />
      );
    case 'node_message':
      if (component.message.includes('Response:')) {
        return <Message className='mb-4'>{decodeText(component.message)}</Message>;
      }
      return <Message className='mb-4'>{component.message}</Message>;
    case 'pdf_preview':
      return (
        <PdfPreview
          file={component.file}
          fileName={component.fileName}
          okLabel={component.okLabel}
          cancelLabel={component.cancelLabel}
          onOk={savePdfFile}
          onCancel={onCancelPdfPreview}
        />
      );
    case 'rpa_suggestion_block':
      return (
        <RpaSuggestionsBlock
          app={component.app}
          rpas={component.rpas}
          onApproveAll={notImplemented}
          onCancel={notImplemented}
        />
      );
    case 'rpa_suggestions_block_light':
      return <RpaSuggestionsBlockLight app={component.app} rpas={component.rpas} />;
    case 'rpa_multiselect':
      return <RPAMultiselect rpas={component.rpas} />;
    case 'screen_recorder':
      return <ScreenRecorder active={component.active} />;
    case 'sign_box':
      return <SignBox />;
    case 'suggestions_row':
      return (
        <SuggestionsRow
          responses={component.options}
          suggestion={component.suggestion}
          onDashboardClick={notImplemented}
          onSuggestionClick={notImplemented}
        />
      );
    case 'voice_recorder':
      return <VoiceRecorder label={component.label} active={component.active} />;
    default:
      return null;
  }
});

export default RenderComponent;
