import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const RegisterAgentForm = () => {
  return (
    <div className="flex flex-col gap-y-10 bg-white mx-8 px-6 pt-10">
      <Input placeholder="کد نمایندگی" />
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="استان" />
        </SelectTrigger>

        <SelectContent side="bottom">
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectContent>
      </Select>
      <Select />
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="شهر" />
        </SelectTrigger>

        <SelectContent side="bottom">
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectContent>
      </Select>
      <Select />
      <Textarea legend="آدرس" />
      <Input />
      <div className="flex gap-x-4 ">
        <Input className="flex-3" />
        <Input className="flex-1" />
      </div>
    </div>
  );
};

export default RegisterAgentForm;
