import { FormControl, FormLabel, Select, HStack, Input, VStack } from '@chakra-ui/react';
import { RepeatType } from '../../types';

interface RepeatScheduleFormProps {
  repeat: {
    type: RepeatType;
    interval: number;
    endDate: string;
  };
  onRepeatTypeChange: (value: RepeatType) => void;
  onRepeatIntervalChange: (value: number) => void;
  onRepeatEndDateChange: (value: string) => void;
}

export const RepeatScheduleForm = ({
  repeat,
  onRepeatTypeChange,
  onRepeatIntervalChange,
  onRepeatEndDateChange,
}: RepeatScheduleFormProps) => {
  return (
    <VStack width="100%">
      <FormControl>
        <FormLabel>반복 유형</FormLabel>
        <Select
          value={repeat.type}
          onChange={(e) => onRepeatTypeChange(e.target.value as RepeatType)}
        >
          <option value="daily">매일</option>
          <option value="weekly">매주</option>
          <option value="monthly">매월</option>
          <option value="yearly">매년</option>
        </Select>
      </FormControl>
      <HStack width="100%">
        <FormControl>
          <FormLabel>반복 간격</FormLabel>
          <Input
            type="number"
            value={repeat.interval}
            onChange={(e) => onRepeatIntervalChange(Number(e.target.value))}
            min={1}
          />
        </FormControl>
        <FormControl>
          <FormLabel>반복 종료일</FormLabel>
          <Input
            type="date"
            value={repeat.endDate}
            onChange={(e) => onRepeatEndDateChange(e.target.value)}
          />
        </FormControl>
      </HStack>
    </VStack>
  );
};
