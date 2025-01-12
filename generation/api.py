from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

class ImageGenerationViewSet(viewsets.ModelViewSet):
    serializer_class = ImageGenerationRequestSerializer
    
    @action(detail=False, methods=['post'])
    def batch_generate(self, request):
        prompts = request.data.get('prompts', [])
        results = []
        
        for prompt in prompts:
            result = self.create_image(prompt)
            results.append(result)
            
        return Response(results)
        
    @action(detail=True, methods=['post'])
    def enhance(self, request, pk=None):
        image = self.get_object()
        enhanced = self.enhance_image(image)
        return Response(enhanced) 