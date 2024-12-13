import {
  getSolanaProvider,
  registerCandidate,
} from "@/app/services/blockchain";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useWallet } from "@solana/wallet-adapter-react";
import { FC, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type CandidateDialogProps = {
  pollId: number;
  pollAddress: string;
  onSuccess: () => Promise<void>;
};

const formSchema = z.object({
  candidateName: z.string().min(2, {
    message: "Candidate must be at least 2 characters.",
  }),
});

const CandidateDialog: FC<CandidateDialogProps> = ({
  pollAddress,
  pollId,
  onSuccess,
}) => {
  const { publicKey, sendTransaction, signTransaction } = useWallet();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: "",
    },
  });
  const [open, setOpen] = useState(false);

  const program = useMemo(() => {
    if (!publicKey) {
      return;
    }

    return getSolanaProvider(publicKey, signTransaction, sendTransaction);
  }, [publicKey, signTransaction, sendTransaction]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!program || !publicKey || !values.candidateName) return;

    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          await registerCandidate(
            program,
            publicKey,
            pollId,
            values.candidateName,
          );

          await onSuccess();
          setOpen(false);
          resolve();
        } catch (error) {
          console.error("Transaction failed:", error);
          reject(error);
        }
      }),
      {
        loading: "Approve transaction...",
        success: "Transaction successful 👌",
        error: "Encountered error 🤯",
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="space-x-2 rounded-full bg-gray-800 px-6 py-2 text-lg font-bold">
          Candidate
          <FaRegEdit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a Candidate</DialogTitle>
          <DialogDescription>
            Give a name to the candidate for the poll
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="candidateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Candidate Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Flynn 17." {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the public displayed candidate name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Register</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CandidateDialog;
