import { Feature, Message } from '@/types/project-creation'
import { Checkbox } from '@cm/ui/components/ui/checkbox'

import { DefinitionTable } from './DefinitionTable'
import { FeatureTable } from './FeatureTable'
import { TeamMemberTable } from './TeamMemberTable'

type ChatMessageProps = {
  message: Message
  selectedSuggestions: string[]
  onSuggestionChange: (suggestion: string, checked: boolean) => void
  onFeatureChange: (features: Feature[], msg: Message) => void
}

export function ChatMessage({
  message,
  selectedSuggestions,
  onSuggestionChange,
  onFeatureChange,
}: ChatMessageProps) {
  if (message.tableData) {
    return (
      <div className="min-w-lg max-w-full">
        {message.tableData.features && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">기능 목록</h3>
            <DefinitionTable data={message.tableData.features} />
          </div>
        )}
        {message.tableData.suggestions && (
          <div>
            <h3 className="font-semibold mb-2">제안</h3>
            {message.tableData.suggestions.map((suggestion, index) => (
              <div key={index} className="mb-4">
                <p className="font-medium mb-1">{suggestion.question}</p>
                <ul className="list-none pl-5 space-y-2">
                  {suggestion.answers.map((answer, ansIndex) => (
                    <li key={ansIndex} className="flex items-center gap-2">
                      <Checkbox
                        id={`suggestion-${index}-${ansIndex}`}
                        checked={selectedSuggestions.includes(answer)}
                        onCheckedChange={(checked) =>
                          onSuggestionChange(answer, checked as boolean)
                        }
                      />
                      <label
                        htmlFor={`suggestion-${index}-${ansIndex}`}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {answer}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        {message.tableData.specifications && (
          <div className="mb-4">
            <h3 className="font-semibold mb-2">기능 명세</h3>
            <FeatureTable
              data={message.tableData.specifications}
              onDataChange={(newFeatures) =>
                onFeatureChange(newFeatures, message)
              }
              readOnly={false}
            />
          </div>
        )}
        {message.tableData.teamMembers && (
          <div className="mb-4">
            <TeamMemberTable
              data={message.tableData.teamMembers}
              onDataChange={() => {}}
              readOnly={true}
            />
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className={`px-3 py-2 rounded-lg text-md max-w-xs break-words ${
        message.sender === 'user'
          ? 'bg-[#795548] text-white'
          : 'bg-[#EFEAE8] text-gray-900'
      }`}
    >
      {message.text}
    </div>
  )
}
